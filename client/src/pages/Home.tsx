import { ArrowRight, Layout } from 'lucide-react';

export default function Home() {
    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="card" style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-md)' }}>
                    <div style={{ padding: 'var(--spacing-md)', background: '#eff6ff', borderRadius: 'var(--radius-full)', color: 'var(--primary)' }}>
                        <Layout size={48} />
                    </div>
                </div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: 'var(--spacing-sm)', letterSpacing: '-0.025em' }}>
                    Production Ready
                </h1>

                <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-xl)', fontSize: '1.125rem' }}>
                    Your modern React application is ready to go. Built with Vite, TypeScript, and a robust folder structure.
                </p>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                    <button className="btn btn-primary">
                        Get Started <ArrowRight size={18} style={{ marginLeft: 'var(--spacing-sm)' }} />
                    </button>
                    <button className="btn" style={{ border: '1px solid var(--border)', backgroundColor: 'white' }}>
                        Documentation
                    </button>
                </div>
            </div>
        </div>
    );
}
