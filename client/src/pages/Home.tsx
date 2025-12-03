import { logout, setAccessToken } from '@/store/auth/authSlice';
import { saveItemToSecureStore } from '@/store/secureStorage';
import { Layout, LogOut, ShieldAlert, RefreshCw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetOwnProfile } from '@/hooks/api/user';

export default function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: userResponse, isLoading, isError, refetch } = useGetOwnProfile();
    const user = userResponse?.data;

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const invalidateAccessToken = () => {
        dispatch(setAccessToken('invalid_token'));
        alert('Access token invalidated! Next API call should trigger refresh.');
    };

    const invalidateRefreshToken = async () => {
        await saveItemToSecureStore('refresh_token', 'invalid_refresh_token');
        alert('Refresh token invalidated! Next refresh attempt should fail and logout.');
    };

    if (isLoading) return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    if (isError) return <div className="container" style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error loading profile</div>;

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-md)' }}>
                    <div style={{ padding: 'var(--spacing-md)', background: '#eff6ff', borderRadius: 'var(--radius-full)', color: 'var(--primary)' }}>
                        <Layout size={48} />
                    </div>
                </div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: 'var(--spacing-sm)', letterSpacing: '-0.025em' }}>
                    Welcome, {user?.name || 'User'}!
                </h1>

                <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-xl)', fontSize: '1.125rem' }}>
                    You are logged in as {user?.email}.
                </p>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <button className="btn btn-primary" onClick={() => refetch()}>
                        Refresh Data <RefreshCw size={18} style={{ marginLeft: 'var(--spacing-sm)' }} />
                    </button>
                    <button className="btn" style={{ border: '1px solid var(--border)', backgroundColor: 'white' }} onClick={handleLogout}>
                        Logout <LogOut size={18} style={{ marginLeft: 'var(--spacing-sm)' }} />
                    </button>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-lg)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-muted)' }}>Token Rotation Testing</h3>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }} onClick={invalidateAccessToken}>
                            Invalidate Access Token <ShieldAlert size={18} style={{ marginLeft: 'var(--spacing-sm)' }} />
                        </button>
                        <button className="btn" style={{ backgroundColor: '#fff7ed', color: '#f97316' }} onClick={invalidateRefreshToken}>
                            Invalidate Refresh Token <ShieldAlert size={18} style={{ marginLeft: 'var(--spacing-sm)' }} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
