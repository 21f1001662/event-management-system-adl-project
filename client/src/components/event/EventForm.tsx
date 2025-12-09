import { useState, useEffect } from 'react';
import { getPresignedUrl, uploadFileToS3 } from '@/api/storage';
import { EventCategory } from '@/api/event/event.dto';
import { Upload, Loader2 } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import './EventForm.css';

interface EventFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    submitLabel: string;
}

const EventForm = ({ initialData, onSubmit, isSubmitting, submitLabel }: EventFormProps) => {
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

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            const dateObj = new Date(initialData.date);
            const dateStr = dateObj.toISOString().split('T')[0];
            const timeStr = dateObj.toTimeString().slice(0, 5);

            setFormData({
                ...initialData,
                date: dateStr,
                time: timeStr,
            });
        }
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const { data } = await getPresignedUrl(file.type);
            await uploadFileToS3(data.url, file);

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
        const dateTime = new Date(`${formData.date}T${formData.time || '00:00'}:00`).toISOString();
        onSubmit({
            ...formData,
            date: dateTime,
            capacity: Number(formData.capacity)
        });
    };

    return (
        <div className="form-section">
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
                <div data-color-mode="light">
                    <MDEditor
                        value={formData.description}
                        onChange={(val) => setFormData(prev => ({ ...prev, description: val || '' }))}
                        height={300}
                        preview="edit"
                    />
                </div>
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

            <div className="sticky-footer">
                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={isSubmitting || uploading}
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                    {isSubmitting ? 'Saving...' : submitLabel}
                </button>
            </div>
        </div>
    );
};

export default EventForm;
