import { useNavigate } from 'react-router-dom';
import { useCreateEvent } from '@/hooks/api/event';
import EventForm from '@/components/event/EventForm';

const CreateEvent = () => {
    const navigate = useNavigate();
    const { mutate: createEvent, isPending: isCreating } = useCreateEvent();

    const handleSubmit = (data: any) => {
        createEvent(data, {
            onSuccess: () => {
                navigate('/organizer');
            },
            onError: (error) => {
                alert('Failed to create event: ' + error.message);
            }
        });
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px', color: '#1a202c' }}>Create New Event</h1>
            <EventForm
                onSubmit={handleSubmit}
                isSubmitting={isCreating}
                submitLabel="Create Event"
            />
        </div>
    );
};

export default CreateEvent;
