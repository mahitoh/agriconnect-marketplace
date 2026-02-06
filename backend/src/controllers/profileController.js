const { supabase, supabaseAdmin } = require('../config/supabase');
const { validationResult } = require('express-validator');

/**
 * Get user profile
 * GET /api/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log('📡 Fetching profile for user:', userId);

    // Use supabaseAdmin to bypass RLS policies
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // No profile found - create one
      console.log('⚠️ No profile found, creating new profile for user:', userId);
      
      // Get user info from auth to populate initial profile
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
      
      const newProfile = {
        id: userId,
        full_name: authUser?.user?.user_metadata?.full_name || '',
        phone: authUser?.user?.user_metadata?.phone || '',
        role: authUser?.user?.user_metadata?.role || 'consumer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: createdProfile, error: createError } = await supabaseAdmin
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating profile:', createError);
        // Return empty profile structure instead of error
        return res.status(200).json({
          success: true,
          message: 'Profile not found, returning defaults',
          data: { 
            profile: {
              id: userId,
              full_name: authUser?.user?.user_metadata?.full_name || '',
              phone: '',
              location: '',
              bio: '',
              farm_details: '',
              farm_name: '',
              years_experience: '',
              certifications: [],
              avatar_url: '',
              banner_url: ''
            }
          }
        });
      }

      console.log('✅ Created new profile:', createdProfile);
      return res.status(200).json({
        success: true,
        message: 'Profile created successfully',
        data: { profile: createdProfile }
      });
    }

    if (error) {
      console.error('❌ Error fetching profile:', error);
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
        error: error.message
      });
    }

    if (!profile) {
      console.log('⚠️ No profile found for user:', userId);
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    console.log('✅ Profile found:', JSON.stringify(profile, null, 2));

    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: { profile }
    });
  } catch (error) {
    console.error('❌ Exception in getProfile:', error);
    next(error);
  }
};

/**
 * Update user profile
 * PUT /api/profile
 */
const updateProfile = async (req, res, next) => {
  try {    const userId = req.user.id;
    const { fullName, phone, bio, location, farmDetails, farmName, yearsExperience, certifications, avatarUrl, bannerUrl } = req.body;

    console.log('📝 Updating profile for user:', userId);
    console.log('📦 Received data:', { fullName, phone, bio, location, farmDetails, farmName, yearsExperience, certifications: certifications?.length, avatarUrl: !!avatarUrl, bannerUrl: !!bannerUrl });

    const updates = {};
    // Only update fields that have actual values (not empty strings)
    // Note: email is stored in auth.users, not profiles table
    if (fullName && fullName.trim()) updates.full_name = fullName.trim();
    if (phone && phone.trim()) updates.phone = phone.trim();
    // For bio and farmDetails, allow empty strings to clear them, but only if explicitly provided
    if (bio !== undefined && bio !== null) updates.bio = bio.trim();
    if (location && location.trim()) updates.location = location.trim();
    if (farmDetails !== undefined && farmDetails !== null) updates.farm_details = farmDetails.trim();
    
    // New fields - only add if the columns exist in the database
    // These will fail silently if columns don't exist, but won't break the whole update
    try {
      if (farmName !== undefined && farmName !== null) updates.farm_name = farmName.trim();
      if (yearsExperience !== undefined && yearsExperience !== null) updates.years_experience = yearsExperience;
      if (certifications !== undefined) updates.certifications = certifications;
      if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;
      if (bannerUrl !== undefined) updates.banner_url = bannerUrl;
    } catch (e) {
      console.log('⚠️ Some new profile fields may not exist in database yet');
    }

    console.log('🔄 Updates to apply:', updates);

    // Check if there are any updates to make
    if (Object.keys(updates).length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No changes to update',
        data: { profile: null }
      });
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Database error updating profile:', error);
      
      // If error is about missing columns, try again with basic fields only
      if (error.message && (error.message.includes('column') || error.message.includes('does not exist'))) {
        console.log('🔄 Retrying with basic fields only...');
        const basicUpdates = {};
        if (fullName && fullName.trim()) basicUpdates.full_name = fullName.trim();
        if (phone && phone.trim()) basicUpdates.phone = phone.trim();
        if (bio !== undefined && bio !== null) basicUpdates.bio = bio.trim();
        if (location && location.trim()) basicUpdates.location = location.trim();
        if (farmDetails !== undefined && farmDetails !== null) basicUpdates.farm_details = farmDetails.trim();

        const { data: basicProfile, error: basicError } = await supabaseAdmin
          .from('profiles')
          .update(basicUpdates)
          .eq('id', userId)
          .select()
          .single();

        if (basicError) {
          console.error('❌ Basic update also failed:', basicError);
          return res.status(500).json({
            success: false,
            message: 'Failed to update profile. Please run database migration.',
            error: basicError.message
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Profile updated (some fields skipped - run database migration for full support)',
          data: { profile: basicProfile }
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
    
    console.log('✅ Profile updated successfully');
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { profile }
    });
  } catch (error) {
    console.error('❌ Exception in updateProfile:', error);
    next(error);
  }
};

/**
 * Get all addresses for user
 * GET /api/profile/addresses
 */
const getAddresses = async (req, res, next) => {
  try {    const userId = req.user.id;

    const { data: addresses, error } = await supabaseAdmin
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to fetch addresses',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Addresses fetched successfully',
      data: {
        addresses,
        count: addresses.length
      }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Create address
 * POST /api/profile/addresses
 */
const createAddress = async (req, res, next) => {
  try {    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const {
      label,
      recipientName,
      phone,
      addressLine1,
      addressLine2,
      city,
      region,
      postalCode,
      isDefault
    } = req.body;

    const { data: address, error } = await supabaseAdmin
      .from('addresses')
      .insert({
        user_id: userId,
        label,
        recipient_name: recipientName,
        phone,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city,
        region,
        postal_code: postalCode,
        is_default: isDefault || false
      })
      .select()
      .single();

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to create address',
        error: error.message
      });
    }    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: { address }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Update address
 * PUT /api/profile/addresses/:id
 */
const updateAddress = async (req, res, next) => {
  try {    const userId = req.user.id;
    const addressId = req.params.id;

    // Check ownership
    const { data: existing } = await supabase
      .from('addresses')
      .select('user_id')
      .eq('id', addressId)
      .single();

    if (!existing || existing.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const {
      label,
      recipientName,
      phone,
      addressLine1,
      addressLine2,
      city,
      region,
      postalCode,
      isDefault
    } = req.body;

    const updates = {};
    if (label !== undefined) updates.label = label;
    if (recipientName) updates.recipient_name = recipientName;
    if (phone) updates.phone = phone;
    if (addressLine1) updates.address_line1 = addressLine1;
    if (addressLine2 !== undefined) updates.address_line2 = addressLine2;
    if (city) updates.city = city;
    if (region) updates.region = region;
    if (postalCode !== undefined) updates.postal_code = postalCode;
    if (isDefault !== undefined) updates.is_default = isDefault;

    const { data: address, error } = await supabaseAdmin
      .from('addresses')
      .update(updates)
      .eq('id', addressId)
      .select()
      .single();

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to update address',
        error: error.message
      });
    }    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: { address }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Delete address
 * DELETE /api/profile/addresses/:id
 */
const deleteAddress = async (req, res, next) => {
  try {    const userId = req.user.id;
    const addressId = req.params.id;

    // Check ownership
    const { data: existing } = await supabase
      .from('addresses')
      .select('user_id')
      .eq('id', addressId)
      .single();

    if (!existing || existing.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const { error } = await supabaseAdmin
      .from('addresses')
      .delete()
      .eq('id', addressId);

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to delete address',
        error: error.message
      });
    }    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
};

