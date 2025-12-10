import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerOrganizer } from '@/api/auth';
import { setTokens, setUser } from '@/store/auth/authSlice';
import { Check, ArrowLeft } from 'lucide-react';
import './OrganizerRegister.css';

const OrganizerRegister = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [bio, setBio] = useState('');
    const [idToken, setIdToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegister = async () => {
        if (!idToken || !bio) return;
        setIsSubmitting(true);
        try {
            const response = await registerOrganizer({ id_token: idToken, bio });
            dispatch(setTokens(response.data.tokens));
            dispatch(setUser(response.data.user));
            navigate('/organizer');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="organizer-register-container">
            <div className="organizer-register-card">
                <h1 className="organizer-register-title">Become an Organizer</h1>
                <p className="organizer-register-subtitle">
                    {!idToken
                        ? "Sign in with Google to verify your identity"
                        : "Tell us a bit about yourself to complete registration"}
                </p>

                <div className="step-indicator">
                    <div className={`step-dot ${!idToken ? 'active' : ''}`}></div>
                    <div className={`step-dot ${idToken ? 'active' : ''}`}></div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {!idToken ? (
                    <div className="google-login-wrapper">
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                if (credentialResponse.credential) {
                                    setIdToken(credentialResponse.credential);
                                    setError(null);
                                }
                            }}
                            onError={() => {
                                setError('Google Login Failed. Please try again.');
                            }}
                            useOneTap
                        />
                    </div>
                ) : (
                    <div className="registration-form">
                        <div className="verified-badge">
                            <Check size={16} />
                            Google Account Verified
                        </div>
                        <textarea
                            placeholder="Write a short bio about yourself and the events you plan to organize..."
                            className="bio-textarea"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            disabled={isSubmitting}
                        />
                        <button
                            onClick={handleRegister}
                            className="register-btn"
                            disabled={!bio.trim() || isSubmitting}
                        >
                            {isSubmitting ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </div>
                )}

                <Link to="/login" className="back-link">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ArrowLeft size={16} />
                        Back to Login
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default OrganizerRegister;
