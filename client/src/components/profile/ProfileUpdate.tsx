import { useState, useEffect } from 'react';
import { useGetOwnProfile, useUpdateProfile } from '@/hooks/api/user';
import { getPresignedUrl, uploadFileToS3 } from '@/api/storage';
import { Camera, Loader2, User } from 'lucide-react';
import './ProfileUpdate.css';

const ProfileUpdate = () => {
    const { data: profileData, isLoading } = useGetOwnProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        profile_picture: ''
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (profileData?.data) {
            setFormData({
                name: profileData.data.name || '',
                bio: profileData.data.bio || '',
                profile_picture: profileData.data.profile_picture || ''
            });
        }
    }, [profileData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const { data } = await getPresignedUrl(file.type);
            await uploadFileToS3(data.url, file);

            const publicUrl = `https://carecirclemedia2.s3.ap-south-1.amazonaws.com/${data.key}`;
            setFormData(prev => ({ ...prev, profile_picture: publicUrl }));

            // Immediately update profile with new image
            updateProfile({ ...formData, profile_picture: publicUrl }, {
                onSuccess: () => {
                    // Optional: Add a subtle notification if needed, or just let the UI reflect the change
                },
                onError: (error) => {
                    alert('Failed to update profile picture: ' + error.message);
                }
            });
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(formData, {
            onSuccess: () => {
                alert('Profile updated successfully');
            },
            onError: (error) => {
                alert('Failed to update profile: ' + error.message);
            }
        });
    };

    if (isLoading) {
        return <div className="profile-update-container"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="profile-update-container">
            <div className="profile-image-section">
                {formData.profile_picture ? (
                    <img src={formData.profile_picture} alt="Profile" className="profile-image" />
                ) : (
                    <div className="profile-placeholder">
                        <User size={48} />
                    </div>
                )}

                {uploading && (
                    <div className="loading-overlay">
                        <Loader2 className="animate-spin" />
                    </div>
                )}

                <label className="image-upload-label">
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                        disabled={uploading}
                    />
                    <Camera size={16} />
                </label>
            </div>

            {profileData?.data?.roles?.includes('organizer') && (
                <div style={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backgroundColor: profileData.data.verified ? '#d1fae5' : '#fee2e2',
                    color: profileData.data.verified ? '#065f46' : '#991b1b',
                    display: 'inline-block',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    border: `1px solid ${profileData.data.verified ? '#a7f3d0' : '#fecaca'}`
                }}>
                    {profileData.data.verified ? 'Account Verified' : 'Account Pending Approval'}
                </div>
            )}

            <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-input"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                        name="bio"
                        className="form-textarea"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                    />
                </div>

                <button
                    type="submit"
                    className="update-btn"
                    disabled={isUpdating || uploading}
                >
                    {isUpdating ? <Loader2 className="animate-spin" size={18} /> : null}
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default ProfileUpdate;
