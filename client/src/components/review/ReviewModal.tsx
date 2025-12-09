import { useState, useEffect } from 'react';
import { createReview, deleteReview } from '@/api/review';
import { Star, X, Trash2 } from 'lucide-react';
import './ReviewModal.css';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: string;
    existingReview?: any;
    onSuccess: () => void;
}

const ReviewModal = ({ isOpen, onClose, eventId, existingReview, onSuccess }: ReviewModalProps) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setReviewText(existingReview.review_text);
        } else {
            setRating(0);
            setReviewText('');
        }
    }, [existingReview, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        if (!reviewText.trim()) {
            setError('Please write a review');
            return;
        }

        try {
            setLoading(true);
            await createReview({ eventId, review_text: reviewText, rating });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            setLoading(true);
            await deleteReview(existingReview.id);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-modal-overlay" onClick={onClose}>
            <div className="review-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2>{existingReview ? 'Your Review' : 'Write a Review'}</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`star-btn ${star <= rating ? 'active' : ''}`}
                                onClick={() => !existingReview && setRating(star)}
                                disabled={!!existingReview}
                            >
                                <Star
                                    size={32}
                                    fill={star <= rating ? "#fbbf24" : "none"}
                                    color={star <= rating ? "#fbbf24" : "#cbd5e0"}
                                />
                            </button>
                        ))}
                    </div>

                    <textarea
                        className="review-textarea"
                        placeholder="Share your experience..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        disabled={!!existingReview || loading}
                    />

                    <div className="modal-actions">
                        {existingReview ? (
                            <button
                                type="button"
                                className="delete-btn"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                <Trash2 size={18} />
                                Delete Review
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
