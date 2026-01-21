import React, { useState } from 'react';
import { Star, Send, X } from 'lucide-react';

const ReviewForm = ({ farmerId, farmerName, onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      alert('Please write at least 10 characters in your review');
      return;
    }

    setIsSubmitting(true);

    // Create review object
    const review = {
      id: Date.now(),
      farmerId,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
      author: 'You', // In real app, this would come from auth context
      avatar: null,
      helpful: 0
    };

    // Simulate API delay
    setTimeout(() => {
      onSubmit(review);
      setIsSubmitting(false);
      setRating(0);
      setComment('');
    }, 500);
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        marginBottom: '24px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
          Rate {farmerName}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div style={{ marginBottom: '20px' }}>
          <label 
            style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '8px' 
            }}
          >
            Your Rating
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  transition: 'transform 0.2s'
                }}
              >
                <Star
                  size={32}
                  fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                  stroke={(hoverRating || rating) >= star ? '#f59e0b' : '#d1d5db'}
                  style={{
                    transition: 'all 0.2s',
                    transform: (hoverRating || rating) >= star ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          )}
        </div>

        {/* Comment */}
        <div style={{ marginBottom: '20px' }}>
          <label 
            style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '8px' 
            }}
          >
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this farmer... What did you purchase? How was the quality? Would you recommend them?"
            rows={4}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2d5f3f'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            {comment.length}/500 characters (minimum 10)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: (isSubmitting || rating === 0 || comment.trim().length < 10) 
              ? '#d1d5db' 
              : 'linear-gradient(135deg, #2d5f3f, #4a7c59)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: (isSubmitting || rating === 0 || comment.trim().length < 10) 
              ? 'not-allowed' 
              : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s'
          }}
        >
          {isSubmitting ? (
            <>
              <div 
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  border: '2px solid white', 
                  borderTop: '2px solid transparent', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite' 
                }} 
              />
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
