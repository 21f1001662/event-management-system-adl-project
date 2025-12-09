import { useState, useEffect } from 'react';
import { getEventReviews } from '@/api/review';
import { Star, User, ChevronLeft, ChevronRight } from 'lucide-react';
import './ReviewList.css';

interface ReviewListProps {
    eventId: string;
}

const ReviewList = ({ eventId }: ReviewListProps) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchReviews();
    }, [eventId, page]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await getEventReviews(eventId, page);
            setReviews(response.data.data.reviews);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                fill={i < rating ? "#fbbf24" : "none"}
                color={i < rating ? "#fbbf24" : "#cbd5e0"}
            />
        ));
    };

    if (loading && reviews.length === 0) return <div className="review-loading">Loading reviews...</div>;

    if (reviews.length === 0) {
        return (
            <div className="no-reviews">
                <p>No reviews yet. Be the first to review!</p>
            </div>
        );
    }

    return (
        <div className="review-list-container">
            <h3>Reviews</h3>
            <div className="reviews-grid">
                {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <div className="reviewer-info">
                                <div className="reviewer-avatar">
                                    <User size={20} />
                                </div>
                                <span className="reviewer-name">{review.user.name}</span>
                            </div>
                            <span className="review-date">
                                {new Date(review.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="review-rating">
                            {renderStars(review.rating)}
                        </div>
                        <p className="review-text">{review.review_text}</p>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="page-btn"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="page-info">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        className="page-btn"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewList;
