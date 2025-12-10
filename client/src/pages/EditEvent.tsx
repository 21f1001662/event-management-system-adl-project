import { useNavigate, useParams } from 'react-router-dom';
import { useGetEvent, useUpdateEvent } from '@/hooks/api/event';
import EventForm from '@/components/event/EventForm';
import { Loader2 } from 'lucide-react';

const EditEvent = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: event, isLoading: isLoadingEvent } = useGetEvent(id || '');
    const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();

    if (isLoadingEvent) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 className="animate-spin" size={48} color="#4c51bf" />
            </div>
        );
    }

    const handleSubmit = (data: any) => {
        if (!id) return;
        updateEvent({ id, data }, {
            onSuccess: () => {
                navigate(`/organizer/events/${id}`);
            },
            onError: (error) => {
                alert('Failed to update event: ' + error.message);
            }
        });
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px', color: '#1a202c', textAlign: 'center' }}>Edit Event</h1>
            <EventForm
                initialData={event}
                onSubmit={handleSubmit}
                isSubmitting={isUpdating}
                submitLabel="Update Event"
            />
        </div>
    );
};

export default EditEvent;
