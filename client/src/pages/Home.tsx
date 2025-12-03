import { logout } from '@/store/auth/authSlice';
import type { RootState } from '@/store';
import { ArrowRight, Layout, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="card" style={{ maxWidth: '600px' }}>
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

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                    <button className="btn btn-primary">
                        Get Started <ArrowRight size={18} style={{ marginLeft: 'var(--spacing-sm)' }} />
                    </button>
                    <button className="btn" style={{ border: '1px solid var(--border)', backgroundColor: 'white' }} onClick={handleLogout}>
                        Logout <LogOut size={18} style={{ marginLeft: 'var(--spacing-sm)' }} />
                    </button>
                </div>
            </div>
        </div>
    );
}
