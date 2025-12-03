import { useLoginWithGoogle } from '@/hooks/api/auth';
import { setTokens, setUser } from '@/store/auth/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { mutate: login, isPending } = useLoginWithGoogle();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSuccess = (credentialResponse: any) => {
        if (credentialResponse.credential) {
            login(
                { id_token: credentialResponse.credential },
                {
                    onSuccess: (data) => {
                        dispatch(setTokens(data.data.tokens));
                        dispatch(setUser(data.data.user));
                        navigate('/');
                    },
                    onError: (error) => {
                        console.error('Login failed:', error);
                        alert('Login failed. Please try again.');
                    },
                }
            );
        }
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Welcome Back</h1>
                <p style={{ marginBottom: 'var(--spacing-xl)', color: 'var(--text-muted)' }}>
                    Sign in to access your account
                </p>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {isPending ? (
                        <p>Signing in...</p>
                    ) : (
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
