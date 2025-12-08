import { AppDataSource } from '../config/database';
import { Event } from '../entities/Event';
import { CreateEventDto, GetEventsQueryDto } from '../dtos/EventDto';
import { addOrdering, addPagination } from '../utils/query.utils';

export class EventService {
    private eventRepository = AppDataSource.getRepository(Event);

    async createEvent(data: CreateEventDto, organizerId: string) {
        const event = this.eventRepository.create({
            ...data,
            organizer_id: organizerId,
        });
        return await this.eventRepository.save(event);
    }

    async getAllEvents(query: GetEventsQueryDto) {
        const { page = 1, limit = 10, search, category, location, organizerId, orderBy, order } = query;
        const skip = (page - 1) * limit;

        let qb = this.eventRepository.createQueryBuilder('event');

        qb.leftJoinAndSelect('event.organizer', 'organizer');
        qb.select([
            'event',
            'organizer.id',
            'organizer.name',
            'organizer.email'
        ]);

        if (search) {
            qb.andWhere('(event.title ILIKE :search OR event.short_description ILIKE :search)', { search: `%${search}%` });
        }

        if (category) {
            qb.andWhere('event.category = :category', { category });
        }

        if (location) {
            qb.andWhere('event.location ILIKE :location', { location: `%${location}%` });
        }

        if (organizerId) {
            qb.andWhere('event.organizer_id = :organizerId', { organizerId });
        }

        qb = addOrdering(qb, orderBy || 'date', order || 'ASC');
        qb = addPagination(qb, limit, skip);

        const [events, total] = await qb.getManyAndCount();

        return {
            events,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
