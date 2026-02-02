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

module.exports = {
  uploadProductImage
};
