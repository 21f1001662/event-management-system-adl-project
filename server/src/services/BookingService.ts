import { AppDataSource } from '../config/database';
import { EventAttendee, AttendeeStatus } from '../entities/EventAttendee';
import { Event } from '../entities/Event';
import { User } from '../entities/User';
import { addOrdering, addPagination } from '../utils/query.utils';

export class BookingService {
    private attendeeRepository = AppDataSource.getRepository(EventAttendee);
    private eventRepository = AppDataSource.getRepository(Event);

    async bookTicket(userId: string, eventId: string) {
        return await AppDataSource.transaction(async (transactionalEntityManager) => {
            const event = await transactionalEntityManager.findOne(Event, {
                where: { id: eventId },
                lock: { mode: 'pessimistic_write' }, // Lock event to prevent race conditions
            });

            if (!event) {
                throw new Error('Event not found');
            }

            const existingBooking = await transactionalEntityManager.findOne(EventAttendee, {
                where: { user_id: userId, event_id: eventId },
            });

            if (existingBooking) {
                throw new Error('User already booked for this event');
            }

            let status = AttendeeStatus.CONFIRMED;
            let waitlistPosition: number | undefined = undefined;

            if (event.attendees_count >= event.capacity) {
                if (!event.allow_waitlist) {
                    throw new Error('Event is fully booked');
                }
                status = AttendeeStatus.WAITLIST;
                event.waitlist_count += 1;
                waitlistPosition = event.waitlist_count;
            } else {
                event.attendees_count += 1;
            }

            const attendee = transactionalEntityManager.create(EventAttendee, {
                user_id: userId,
                event_id: eventId,
                status,
                waitlist_position: waitlistPosition,
            });

            await transactionalEntityManager.save(Event, event);
            return await transactionalEntityManager.save(EventAttendee, attendee);
        });
    }

    async getMyTickets(userId: string, query: any) {
        const { page = 1, limit = 10, status, eventName, orderBy, order } = query;
        const skip = (page - 1) * limit;

        let qb = this.attendeeRepository.createQueryBuilder('attendee');

        qb.leftJoinAndSelect('attendee.event', 'event');
        qb.leftJoinAndSelect('event.organizer', 'organizer');
        qb.where('attendee.user_id = :userId', { userId });

        if (status) {
            qb.andWhere('attendee.status = :status', { status });
        }

        if (eventName) {
            qb.andWhere('event.title ILIKE :eventName', { eventName: `%${eventName}%` });
        }

        // Handle ordering
        if (orderBy === 'event_date') {
            qb.orderBy('event.date', order || 'ASC');
        } else {
            qb = addOrdering(qb, orderBy || 'created_at', order || 'DESC');
        }

        qb = addPagination(qb, limit, skip);

        const [tickets, total] = await qb.getManyAndCount();

        return {
            tickets,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async cancelTicket(userId: string, bookingId: string) {
        return await AppDataSource.transaction(async (transactionalEntityManager) => {
            const booking = await transactionalEntityManager.findOne(EventAttendee, {
                where: { id: bookingId },
                relations: ['event'],
                lock: { mode: 'pessimistic_write' },
            });

            if (!booking) {
                throw new Error('Booking not found');
            }

            if (booking.user_id !== userId) {
                throw new Error('Unauthorized to cancel this booking');
            }

            const event = await transactionalEntityManager.findOne(Event, {
                where: { id: booking.event_id },
                lock: { mode: 'pessimistic_write' },
            });

            if (!event) {
                throw new Error('Event not found');
            }

            if (booking.status === AttendeeStatus.CONFIRMED) {
                // Check if there is a waitlist
                if (event.waitlist_count > 0) {
                    // Get the first person on the waitlist
                    const firstWaitlisted = await transactionalEntityManager.findOne(EventAttendee, {
                        where: { event_id: event.id, status: AttendeeStatus.WAITLIST, waitlist_position: 1 },
                    });

                    if (firstWaitlisted) {
                        // Promote to confirmed
                        firstWaitlisted.status = AttendeeStatus.CONFIRMED;
                        firstWaitlisted.status = AttendeeStatus.CONFIRMED;
                        firstWaitlisted.waitlist_position = null;
                        await transactionalEntityManager.save(EventAttendee, firstWaitlisted);

                        // Decrement waitlist count
                        event.waitlist_count -= 1;

                        // Shift other waitlisted attendees up
                        await transactionalEntityManager.createQueryBuilder()
                            .update(EventAttendee)
                            .set({ waitlist_position: () => 'waitlist_position - 1' })
                            .where('event_id = :eventId', { eventId: event.id })
                            .andWhere('status = :status', { status: AttendeeStatus.WAITLIST })
                            .andWhere('waitlist_position > 1')
                            .execute();
                    } else {
                        // Should not happen if waitlist_count > 0, but safe fallback
                        event.attendees_count -= 1;
                    }
                } else {
                    event.attendees_count -= 1;
                }
            } else if (booking.status === AttendeeStatus.WAITLIST) {
                // If cancelling a waitlisted ticket, shift others up
                if (booking.waitlist_position) {
                    await transactionalEntityManager.createQueryBuilder()
                        .update(EventAttendee)
                        .set({ waitlist_position: () => 'waitlist_position - 1' })
                        .where('event_id = :eventId', { eventId: event.id })
                        .andWhere('status = :status', { status: AttendeeStatus.WAITLIST })
                        .andWhere('waitlist_position > :position', { position: booking.waitlist_position })
                        .execute();
                }
                event.waitlist_count -= 1;
            }

            await transactionalEntityManager.save(Event, event);
            await transactionalEntityManager.remove(EventAttendee, booking);

            return { message: 'Booking cancelled successfully' };
        });
    }
}
