const { supabaseAdmin } = require('../config/supabase');

/**
 * Upload product image to Supabase Storage
 * POST /api/products/upload-image
 */
const uploadProductImage = async (req, res, next) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided. Please upload an image.'
      });
    }

    const farmerId = req.user.id;
    const file = req.file;
    const bucketName = 'product-images';
    
    // Create unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const fileName = `${farmerId}/${timestamp}-${randomStr}-${file.originalname}`;

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        metadata: {
          farmerId,
          originalName: file.originalname,
          uploadedAt: new Date().toISOString()
        }
      });

    if (uploadError) {
      console.error('❌ [UPLOAD] Upload error:', uploadError.message);
      return res.status(500).json({
        message: 'Failed to upload image',
        error: uploadError.message
      });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const imageUrl = urlData?.publicUrl || '';

    console.log('✅ [UPLOAD] Image uploaded successfully');

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        fileName,
        imageUrl,
        size: file.size,
        mimetype: file.mimetype
      }
    });
  } catch (error) {
    console.error('❌ [UPLOAD] Unexpected error:', error.message);
    next(error);
  }
};

/**
 * Upload profile image (avatar or banner) to Supabase Storage
 * POST /api/profile/upload-image
 */
const uploadProfileImage = async (req, res, next) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided. Please upload an image.'
      });
    }

    const userId = req.user.id;
    const file = req.file;
    const imageType = req.query.type || 'avatar'; // 'avatar' or 'banner'
    const bucketName = 'profile-images';
    
    // Create unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const fileName = `${userId}/${imageType}-${timestamp}-${randomStr}-${file.originalname}`;

    console.log(`📷 [UPLOAD] Uploading ${imageType} for user ${userId}`);

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
        metadata: {
          userId,
          imageType,
          originalName: file.originalname,
          uploadedAt: new Date().toISOString()
        }
      });

    if (uploadError) {
      console.error('❌ [UPLOAD] Profile image upload error:', uploadError.message);
      
      // If bucket doesn't exist, try using product-images bucket as fallback
      if (uploadError.message.includes('not found') || uploadError.message.includes('does not exist')) {
        console.log('⚠️ [UPLOAD] profile-images bucket not found, using product-images as fallback');
        
        const fallbackFileName = `profiles/${userId}/${imageType}-${timestamp}-${randomStr}-${file.originalname}`;
        const { data: fallbackData, error: fallbackError } = await supabaseAdmin.storage
          .from('product-images')
          .upload(fallbackFileName, file.buffer, {
            contentType: file.mimetype,
            upsert: true
          });

        if (fallbackError) {
          return res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: fallbackError.message
          });
        }

        const { data: fallbackUrlData } = supabaseAdmin.storage
          .from('product-images')
          .getPublicUrl(fallbackFileName);

        return res.status(200).json({
          success: true,
          message: 'Image uploaded successfully (fallback bucket)',
          data: {
            fileName: fallbackFileName,
            imageUrl: fallbackUrlData?.publicUrl || '',
            size: file.size,
            mimetype: file.mimetype,
            imageType
          }
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: uploadError.message
      });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const imageUrl = urlData?.publicUrl || '';

    console.log(`✅ [UPLOAD] ${imageType} uploaded successfully: ${imageUrl}`);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        fileName,
        imageUrl,
        size: file.size,
        mimetype: file.mimetype,
        imageType
      }
    });
  } catch (error) {
    console.error('❌ [UPLOAD] Unexpected error:', error.message);
    next(error);
  }
};

module.exports = {
  uploadProductImage,
  uploadProfileImage
};
