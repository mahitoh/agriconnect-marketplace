const express = require('express');
const { supabase, supabaseAdmin } = require('../config/supabase');
const { generateToken } = require('../controllers/authController');

const router = express.Router();

/**
 * @route   GET /api/oauth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get('/google', async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Return the OAuth URL
    res.status(200).json({
      success: true,
      data: {
        url: data.url
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate Google sign-in.',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/oauth/callback
 * @desc    Handle OAuth callback and create/update user profile
 * @access  Public
 */
router.post('/callback', async (req, res) => {
  try {
    const { access_token, refresh_token } = req.body;

    if (!access_token) {
      return res.status(400).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Get user from Supabase using the access token
    const { data: { user }, error: authError } = await supabase.auth.getUser(access_token);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token'
      });
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    let profileData;

    if (!existingProfile) {
      // Create new profile for Google user
      const { data: newProfile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
          role: 'customer', // Default role for OAuth users
          phone: user.user_metadata?.phone || null,
          approved: true // Auto-approve OAuth users
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      profileData = newProfile;
    } else {
      profileData = existingProfile;
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Google authentication successful!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: profileData?.full_name || user.user_metadata?.name,
          role: profileData?.role || 'customer',
          phone: profileData?.phone,
          approved: profileData?.approved !== undefined ? profileData.approved : true,
          provider: 'google'
        },
        token,
        access_token,
        refresh_token
      }
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed.',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/oauth/google/mobile
 * @desc    Handle Google sign-in for mobile/web (direct token exchange)
 * @access  Public
 */
router.post('/google/mobile', async (req, res) => {
  try {
    const { id_token } = req.body;

    if (!id_token) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    // Sign in with Google ID token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: id_token,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    const user = data.user;

    // Create or update profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
        role: 'customer',
        phone: user.user_metadata?.phone || null,
        approved: true
      }, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Google authentication successful!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: profileData?.full_name || user.user_metadata?.name,
          role: profileData?.role || 'customer',
          phone: profileData?.phone,
          approved: true,
          provider: 'google'
        },
        token
      }
    });
  } catch (error) {
    console.error('Google mobile auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed.',
      error: error.message
    });
  }
});

module.exports = router;
