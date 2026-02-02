const { supabase, supabaseAdmin } = require('../config/supabase');
const { validationResult } = require('express-validator');

/**
 * Get user profile
 * GET /api/profile
 */
const getProfile = async (req, res, next) => {
  try {    const userId = req.user.id;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: { profile }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Update user profile
 * PUT /api/profile
 */
const updateProfile = async (req, res, next) => {
  try {    const userId = req.user.id;
    const { fullName, phone, bio, location, farmDetails } = req.body;

    const updates = {};
    if (fullName) updates.full_name = fullName;
    if (phone) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (farmDetails !== undefined) updates.farm_details = farmDetails;

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { profile }
    });
  } catch (error) {    next(error);
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

