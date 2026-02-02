const { supabaseAdmin } = require('../config/supabase');

// Helper function to create a notification
exports.createNotification = async (userId, type, title, message, link = null) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        link
      })
      .select()
      .single();

    if (error) {      return null;
    }

    return data;
  } catch (error) {    return null;
  }
};

// Get user's notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { read, type, page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Filter by read status
    if (read !== undefined) {
      const isRead = read === 'true' || read === true;
      query = query.eq('read', isRead);
    }

    // Filter by type
    if (type) {
      query = query.eq('type', type);
    }

    query = query.range(offset, offset + limitNum - 1);

    const { data: notifications, error, count } = await query;

    if (error) {      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }

    const totalPages = Math.ceil(count / limitNum);

    res.json({
      notifications,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: count,
        itemsPerPage: limitNum
      }
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const { count, error } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {      return res.status(500).json({ error: 'Failed to fetch unread count' });
    }

    res.json({ unreadCount: count });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    // Verify ownership
    const { data: notification, error: fetchError } = await supabaseAdmin
      .from('notifications')
      .select('id, user_id, read')
      .eq('id', notificationId)
      .single();

    if (fetchError || !notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.user_id !== userId) {
      return res.status(403).json({ 
        error: 'You can only update your own notifications' 
      });
    }

    if (notification.read) {
      return res.json({ 
        message: 'Notification already marked as read',
        notification 
      });
    }

    // Mark as read
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('notifications')
      .update({ 
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .select()
      .single();

    if (updateError) {      return res.status(500).json({ error: 'Failed to update notification' });
    }

    res.json({
      message: 'Notification marked as read',
      notification: updated
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ 
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {      return res.status(500).json({ error: 'Failed to update notifications' });
    }

    res.json({ message: 'All notifications marked as read' });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    // Verify ownership
    const { data: notification, error: fetchError } = await supabaseAdmin
      .from('notifications')
      .select('id, user_id')
      .eq('id', notificationId)
      .single();

    if (fetchError || !notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.user_id !== userId) {
      return res.status(403).json({ 
        error: 'You can only delete your own notifications' 
      });
    }

    // Delete notification
    const { error: deleteError } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (deleteError) {      return res.status(500).json({ error: 'Failed to delete notification' });
    }

    res.json({ message: 'Notification deleted successfully' });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Get notification preferences
exports.getPreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    let { data: preferences, error } = await supabaseAdmin
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    // If no preferences exist, create default ones
    if (error && error.code === 'PGRST116') {
      const { data: newPrefs, error: createError } = await supabaseAdmin
        .from('notification_preferences')
        .insert({
          user_id: userId,
          email_notifications: true,
          order_updates: true,
          review_notifications: true,
          stock_alerts: true,
          marketing_emails: false
        })
        .select()
        .single();

      if (createError) {        return res.status(500).json({ error: 'Failed to create preferences' });
      }

      preferences = newPrefs;
    } else if (error) {      return res.status(500).json({ error: 'Failed to fetch preferences' });
    }

    res.json({ preferences });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Update notification preferences
exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      emailNotifications,
      orderUpdates,
      reviewNotifications,
      stockAlerts,
      marketingEmails
    } = req.body;

    // Build update object
    const updates = {};
    if (typeof emailNotifications === 'boolean') {
      updates.email_notifications = emailNotifications;
    }
    if (typeof orderUpdates === 'boolean') {
      updates.order_updates = orderUpdates;
    }
    if (typeof reviewNotifications === 'boolean') {
      updates.review_notifications = reviewNotifications;
    }
    if (typeof stockAlerts === 'boolean') {
      updates.stock_alerts = stockAlerts;
    }
    if (typeof marketingEmails === 'boolean') {
      updates.marketing_emails = marketingEmails;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        error: 'No valid preference updates provided' 
      });
    }

    // Try to update existing preferences
    const { data: preferences, error } = await supabaseAdmin
      .from('notification_preferences')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {      return res.status(500).json({ error: 'Failed to update preferences' });
    }

    res.json({
      message: 'Preferences updated successfully',
      preferences
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Send notification to specific user(s)
exports.sendNotification = async (req, res) => {
  try {
    const { userIds, type, title, message, link } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ 
        error: 'userIds must be a non-empty array' 
      });
    }

    if (!type || !title || !message) {
      return res.status(400).json({ 
        error: 'type, title, and message are required' 
      });
    }

    // Create notifications for all users
    const notifications = userIds.map(userId => ({
      user_id: userId,
      type,
      title,
      message,
      link: link || null
    }));

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert(notifications)
      .select();

    if (error) {      return res.status(500).json({ error: 'Failed to send notifications' });
    }

    res.json({
      message: `Notifications sent to ${userIds.length} user(s)`,
      notifications: data
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

