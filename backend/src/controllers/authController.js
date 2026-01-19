const { supabase, supabaseAdmin } = require('../config/supabase');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

/**
 * Generate JWT token for authenticated user
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || 'customer'
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Register a new user
 * POST /api/auth/signup
 */
const signup = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, fullName, role, phone } = req.body;

    // Validate role
    const validRoles = ['customer', 'farmer'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either "customer" or "farmer".'
      });
    }

    // Sign up user with Supabase Auth - sends verification email and requires confirm
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role || 'customer',
          phone: phone || null,
          approved: role === 'farmer' ? false : true
        },
        emailRedirectTo: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/confirm`
      }
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: authError.message
      });
    }

    if (!authData.user) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create user account'
      });
    }

    // Create or update profile in profiles table using upsert
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: authData.user.id,
          full_name: fullName,
          role: role || 'customer',
          phone: phone || null,
          approved: role === 'farmer' ? false : true
        },
        {
          onConflict: 'id',
          ignoreDuplicates: false
        }
      )
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      
      // If profile creation fails, delete the auth user and return error
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create user profile. Please try again.',
        error: profileError.message
      });
    }

    console.log('✅ Profile created/updated successfully:', profileData);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please verify your email address. Check your inbox for a confirmation link.',
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          fullName: fullName,
          role: role || 'customer',
          phone: phone || null,
          approved: role === 'farmer' ? false : true,
          email_verified: false
        }
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: error.message
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Provide more detailed error message
      let message = 'Invalid email or password.';
      
      if (error.message.includes('Email not confirmed')) {
        message = 'Please confirm your email address before logging in.';
      } else if (error.message.includes('Invalid login credentials')) {
        message = 'Invalid email or password.';
      }
      
      return res.status(401).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { debug: error.message })
      });
    }

    // Get user profile from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    // Use profile data if available, otherwise fall back to user_metadata
    const userRole = profileData?.role || data.user.user_metadata?.role || 'customer';
    const isApproved = profileData?.approved !== undefined ? profileData.approved : data.user.user_metadata?.approved;
    const fullName = profileData?.full_name || data.user.user_metadata?.full_name;
    const phone = profileData?.phone || data.user.user_metadata?.phone;

    if (userRole === 'farmer' && !isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your farmer account is pending admin approval.'
      });
    }

    // Generate JWT token
    const token = generateToken(data.user);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: fullName,
          role: userRole,
          phone: phone,
          approved: isApproved
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: error.message
    });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful!'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed. Please try again.',
      error: error.message
    });
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getProfile = async (req, res) => {
  try {
    // Get user's email from Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
    
    if (authError) {
      console.error('Auth fetch error:', authError);
    }

    // Get full profile from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          email: user?.email || req.user.email,  // Get email from auth
          role: profileData?.role || req.user.role,
          fullName: profileData?.full_name || null,
          phone: profileData?.phone || null,
          approved: profileData?.approved !== undefined ? profileData.approved : false,
          createdAt: profileData?.created_at || null,
          updatedAt: profileData?.updated_at || null
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile.',
      error: error.message
    });
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
const refreshToken = async (req, res) => {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      return res.status(401).json({
        success: false,
        message: 'Failed to refresh token.'
      });
    }

    const token = generateToken(data.user);

    res.status(200).json({
      success: true,
      data: {
        token
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed.',
      error: error.message
    });
  }
};

/**
 * Verify email with token
 * POST /api/auth/verify-email
 */
const verifyEmail = async (req, res) => {
  try {
    const { token, type } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Verify the token with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type || 'email'
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
        error: error.message
      });
    }

    // Update profile to mark email as verified
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        email_verified: true,
        updated_at: new Date()
      })
      .eq('id', data.user.id)
      .select()
      .single();

    if (profileError) {
      console.error('Profile update error:', profileError);
    }

    // Generate JWT token
    const jwtToken = generateToken(data.user);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          email_verified: true,
          role: profileData?.role || 'customer'
        },
        token: jwtToken
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed.',
      error: error.message
    });
  }
};

/**
 * Resend verification email
 * POST /api/auth/resend-verification
 */
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    // Resend email verification
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.toLowerCase()
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification email resent successfully. Check your inbox.'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email.',
      error: error.message
    });
  }
};

module.exports = {
  generateToken,
  signup,
  login,
  logout,
  getProfile,
  refreshToken,
  verifyEmail,
  resendVerification
};
