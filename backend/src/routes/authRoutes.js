const express = require('express');
const { body } = require('express-validator');
const {
  signup,
  login,
  logout,
  getProfile,
  refreshToken,
  verifyEmail,
  resendVerification
} = require('../controllers/authController');
const { promoteToAdmin } = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2 })
      .withMessage('Full name must be at least 2 characters long'),
    body('role')
      .optional()
      .isIn(['customer', 'farmer'])
      .withMessage('Role must be either "customer" or "farmer"'),
    body('phone')
      .optional()
      .matches(/^[0-9]{9,15}$/)
      .withMessage('Please provide a valid phone number')
  ],
  signup
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  login
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, getProfile);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token (accepts expired token)
 * @access  Public (validates token signature internally)
 */
router.post('/refresh', refreshToken);

/**
 * @route   POST /api/auth/promote-admin
 * @desc    Promote a user to admin (TEMPORARY - use with caution)
 * @access  Public (but requires secret)
 */
router.post('/promote-admin', promoteToAdmin);

/**
 * @route   GET /api/auth/confirm
 * @desc    Handle email confirmation callback from Supabase (GET request from email link)
 * @access  Public
 */
router.get('/confirm', async (req, res) => {
  // Return an HTML page that processes the URL hash with JavaScript
  return res.send(`
    <html>
      <head>
        <title>Verifying Email...</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            margin: 0;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            max-width: 500px;
            margin: 0 auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          h1 { color: #667eea; margin-bottom: 20px; }
          p { color: #666; }
          a {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container" id="container">
          <div class="loader"></div>
          <h1>Verifying Email...</h1>
          <p>Please wait while we verify your email address.</p>
        </div>

        <script>
          // Parse URL hash for Supabase auth parameters
          const hash = window.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const type = params.get('type') || 'signup';
          const error = params.get('error');
          const errorDescription = params.get('error_description');

          async function verifyEmail() {
            try {
              if (error) {
                throw new Error(errorDescription || error);
              }

              if (!accessToken) {
                throw new Error('No access token found. The verification link may be invalid or expired.');
              }

              // Call backend endpoint with the access token
              const response = await fetch('/api/auth/verify-token', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  access_token: accessToken,
                  refresh_token: refreshToken,
                  type: type
                })
              });

              const result = await response.json();

              if (!response.ok) {
                throw new Error(result.message || 'Verification failed');
              }

              // Success
              document.getElementById('container').innerHTML = \`
                <h1 style="color: #28a745;">✅ Email Verified!</h1>
                <p style="color: #155724; background: #d4edda; padding: 15px; border-radius: 6px; margin: 20px 0;">
                  Your email has been successfully verified.
                </p>
                <p>You can now log in to your account.</p>
                <a href="http://localhost:5000/test">Go to Login</a>
              \`;
            } catch (err) {
              console.error('Verification error:', err);
              document.getElementById('container').innerHTML = \`
                <h1 style="color: #dc3545;">❌ Verification Failed</h1>
                <p style="color: #721c24; background: #f8d7da; padding: 15px; border-radius: 6px; margin: 20px 0;">
                  \${err.message}
                </p>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                  💡 <strong>Tip:</strong> Verification links expire after 24 hours.<br>
                  Click the link again in the email, or use "Resend Verification" at login.
                </p>
                <a href="http://localhost:5000/test">← Back to Login</a>
              \`;
            }
          }

          // Run verification on page load
          verifyEmail();
        </script>
      </body>
    </html>
  `);
});

/**
 * @route   POST /api/auth/verify-token
 * @desc    Verify access token from email link and update profile
 * @access  Public
 */
router.post('/verify-token', async (req, res) => {
  try {
    const { access_token, refresh_token } = req.body;

    if (!access_token) {
      return res.status(400).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Get user from Supabase using the access token
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(access_token);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token',
        error: authError?.message
      });
    }

    // Update profile email_verified status
    const { supabaseAdmin } = require('../config/supabase');
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        email_verified: true,
        updated_at: new Date()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (profileError) {
      console.error('Profile update error:', profileError);
    }

    // Generate JWT token
    const { generateToken } = require('../controllers/authController');
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          email_verified: true,
          fullName: profileData?.full_name,
          role: profileData?.role || 'customer'
        },
        token
      }
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed.',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email with token from confirmation email
 * @access  Public
 */
router.post('/verify-email', verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification email
 * @access  Public
 */
router.post('/resend-verification', resendVerification);

module.exports = router;
