import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateEvent } from '@/hooks/api/event';
import { getPresignedUrl, uploadFileToS3 } from '@/api/storage';
import { EventCategory } from '@/api/event/event.dto';
import './CreateEvent.css';
import { Upload, MapPin, Users, Loader2 } from 'lucide-react';

const CreateEvent = () => {
    const navigate = useNavigate();
    const { mutate: createEvent, isPending: isCreating } = useCreateEvent();

    // Mobile Tab State
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        short_description: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: EventCategory.TECH,
        capacity: 100,
        image_url: '',
        video_url: ''
    });

    // File Upload State
    const [uploading, setUploading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            // 1. Get Presigned URL
            const { data } = await getPresignedUrl(file.type);

            // 2. Upload to S3
            await uploadFileToS3(data.url, file);

            // 3. Update Form Data with the key (which is the filename in our simplified service)
            // Construct the public URL assuming a standard S3 public bucket structure or CloudFront
            // For this project, we'll assume direct S3 access: https://{bucket}.s3.{region}.amazonaws.com/{key}
            // BUT, the user's previous code just returned the key. Let's assume we need to store the full URL or just the key.
            // The DTO expects a URL. Let's construct it or use the one returned if it was a read URL (but it was a PUT url).
            // Actually, the presigned URL is for PUT. The public URL needs to be constructed.
            // Let's assume the backend *could* return the public URL, but for now we'll construct it or just use the key if the frontend knows the base URL.
            // To be safe and simple, let's assume the `data.key` is what we need to store if we had a way to serve it, 
            // but for a public bucket, the URL is `https://{bucket}.s3.amazonaws.com/{key}`.
            // Let's hardcode the base URL pattern for now or just use the key if the app handles it.
            // Wait, the user request didn't specify how to serve. Let's assume we store the full URL.
            // We need the bucket name and region to construct the URL.
            // Let's ask the backend for the public URL or just use a placeholder for now if we can't derive it.
            // Actually, `data.url` is the signed PUT url. `data.key` is the filename.
            // Let's try to construct a standard S3 URL.
            // A better approach for the future: Backend returns the public URL.
            // For now, I will use a placeholder base URL + key, or just the key if I can't guess.
            // Let's use a generic S3 URL format: `https://carecirclemedia2.s3.ap-south-1.amazonaws.com/${data.key}` based on user's env vars.

            const publicUrl = `https://carecirclemedia2.s3.ap-south-1.amazonaws.com/${data.key}`;

            if (file.type.startsWith('image/')) {
                setFormData(prev => ({ ...prev, image_url: publicUrl }));
            } else if (file.type.startsWith('video/')) {
                setFormData(prev => ({ ...prev, video_url: publicUrl }));
            }

        } catch (error) {
            console.error('Upload failed:', error);
            alert('File upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = () => {
        // Combine date and time
        const dateTime = new Date(`${formData.date}T${formData.time || '00:00'}:00`).toISOString();

        createEvent({
            ...formData,
            date: dateTime,
            capacity: Number(formData.capacity)
        }, {
            onSuccess: () => {
                navigate('/organizer');
            },
            onError: (error) => {
                alert('Failed to create event: ' + error.message);
            }
        });
    };

    return (
        <div className="create-event-container">
            {/* Mobile Tabs */}
            <div className="mobile-tabs">
                <button
                    className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('edit')}
                >
                    Edit
                </button>
                <button
                    className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preview')}
                >
                    Preview
                </button>
            </div>

            <div className="split-layout">
                {/* Left Panel: Form */}
                <div className={`left-panel ${activeTab === 'edit' ? 'active' : ''}`}>
                    <div className="form-section">
                        <h1 className="form-title">Create New Event</h1>

                        <div className="form-group">
                            <label className="form-label">Event Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-input"
                                placeholder="e.g. Tech Conference 2025"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Short Description</label>
                            <input
                                type="text"
                                name="short_description"
                                className="form-input"
                                placeholder="Brief summary for cards..."
                                value={formData.short_description}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Full Description (Markdown supported)</label>
                            <textarea
                                name="description"
                                className="form-textarea"
                                placeholder="# Event Details\n\nTell people what your event is about..."
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-input"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Time</label>
                                <input
                                    type="time"
                                    name="time"
                                    className="form-input"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                name="location"
                                className="form-input"
                                placeholder="e.g. Convention Center, NY"
                                value={formData.location}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Category</label>
                                <select
                                    name="category"
                                    className="form-select"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                >
                                    {Object.values(EventCategory).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Capacity</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    className="form-input"
                                    min="1"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Event Image</label>
                            <div className="file-upload-area">
                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                />
                                <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                    {uploading ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                            <Loader2 className="animate-spin" /> Uploading...
                                        </div>
                                    ) : (
                                        <>
                                            <Upload size={32} style={{ marginBottom: '10px', color: '#a0aec0' }} />
                                            <p style={{ color: '#4a5568' }}>Click to upload event image</p>
                                        </>
                                    )}
                                </label>
                            </div>
                            {formData.image_url && (
                                <div className="upload-preview">
                                    <img src={formData.image_url} alt="Preview" />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Event Video (Optional)</label>
                            <div className="file-upload-area">
                                <input
                                    type="file"
                                    id="video-upload"
                                    accept="video/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                />
                                <label htmlFor="video-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                    {uploading ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                            <Loader2 className="animate-spin" /> Uploading...
                                        </div>
                                    ) : (
                                        <>
                                            <Upload size={32} style={{ marginBottom: '10px', color: '#a0aec0' }} />
                                            <p style={{ color: '#4a5568' }}>Click to upload event video</p>
                                        </>
                                    )}
                                </label>
                            </div>
                            {formData.video_url && (
                                <div className="upload-preview">
                                    <video src={formData.video_url} controls />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Preview */}
                <div className={`right-panel ${activeTab === 'preview' ? 'active' : ''}`}>
                    <div className="preview-title">Live Preview</div>

                    <div className="event-preview-card">
                        <div className="preview-image">
                            {formData.video_url ? (
                                <video src={formData.video_url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : formData.image_url ? (
                                <img src={formData.image_url} alt="Event" />
                            ) : (
                                <span>No Media</span>
                            )}
                        </div>
                        <div className="preview-content">
                            <div className="preview-date">
                                {formData.date ? new Date(formData.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : 'Date'}
                            </div>
                            <h2 className="preview-event-title">
                                {formData.title || 'Event Title'}
                            </h2>
                            <p className="preview-desc">
                                {formData.short_description || 'Short description will appear here...'}
                            </p>

                            <div className="preview-meta">
                                <div className="preview-meta-item">
                                    <MapPin size={16} />
                                    <span>{formData.location || 'Location'}</span>
                                </div>
                                <div className="preview-meta-item">
                                    <Users size={16} />
                                    <span>{formData.capacity} Capacity</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky-footer">
                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={isCreating || uploading}
                >
                    {isCreating ? <Loader2 className="animate-spin" /> : null}
                    {isCreating ? 'Creating...' : 'Create Event'}
                </button>
            </div>
        </div>
    );
};

export default CreateEvent;
