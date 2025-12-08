import { Request, Response } from 'express';
import { EventService } from '../services/EventService';
import { CreateEventDto, GetEventsQueryDto } from '../dtos/EventDto';

export class EventController {
    private static eventService = new EventService();

    static async createEvent(req: Request, res: Response) {
        try {
            const organizerId = (req as any).user.id;
            const data: CreateEventDto = req.body;
            const event = await EventController.eventService.createEvent(data, organizerId);
            res.status(201).json({
                message: 'Event created successfully',
                data: event,
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAllEvents(req: Request, res: Response) {
        try {
            const query: GetEventsQueryDto = req.query;
            const result = await EventController.eventService.getAllEvents(query);
            res.json({
                message: 'Events retrieved successfully',
                data: result,
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
