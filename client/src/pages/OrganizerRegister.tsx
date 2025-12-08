import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerOrganizer } from '@/api/auth';
import { setTokens, setUser } from '@/store/auth/authSlice';

const OrganizerRegister = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [bio, setBio] = useState('');
    const [idToken, setIdToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async () => {
        if (!idToken || !bio) return;
        try {
            const response = await registerOrganizer({ id_token: idToken, bio });
            dispatch(setTokens(response.data.tokens));
            dispatch(setUser(response.data.user));
            navigate('/organizer');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded shadow-md w-96">
                <h1 className="mb-4 text-2xl font-bold text-center">Organizer Registration</h1>

                {error && <p className="mb-4 text-red-500">{error}</p>}

                {!idToken ? (
                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                if (credentialResponse.credential) {
                                    setIdToken(credentialResponse.credential);
                                }
                            }}
                            onError={() => {
                                setError('Google Login Failed');
                            }}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <p className="text-green-600 text-center">Google Account Verified!</p>
                        <textarea
                            placeholder="Tell us about yourself (Bio)"
                            className="w-full p-2 border rounded"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                        <button
                            onClick={handleRegister}
                            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                            Register
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizerRegister;
