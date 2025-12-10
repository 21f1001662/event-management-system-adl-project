import { Request, Response } from 'express';
import { EventService } from '../services/EventService';
import { CreateEventDto, GetEventsQueryDto } from '../dtos/EventDto';

export class EventController {
    private static eventService = new EventService();

    static async createEvent(req: Request, res: Response) {
        try {
            const organizerId = (req as any).user.id;
            const user = await EventController.eventService.getUser(organizerId);

            if (!user?.verified) {
                return res.status(403).json({ message: 'Organizer account is not verified. Please wait for admin approval.' });
            }

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
    static async getEventById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const event = await EventController.eventService.getEventById(id);
            res.json({
                message: 'Event retrieved successfully',
                data: event,
            });
        } catch (error: any) {
            if (error.message === 'Event not found') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    static async updateEvent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const organizerId = (req as any).user.id;
            const data = req.body;
            const event = await EventController.eventService.updateEvent(id, data, organizerId);
            res.json({
                message: 'Event updated successfully',
                data: event,
            });
        } catch (error: any) {
            if (error.message === 'Event not found') {
                res.status(404).json({ message: error.message });
            } else if (error.message === 'Unauthorized to update this event') {
                res.status(403).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    static async deleteEvent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const organizerId = (req as any).user.id;
            await EventController.eventService.deleteEvent(id, organizerId);
            res.json({
                message: 'Event deleted successfully',
            });
        } catch (error: any) {
            if (error.message === 'Event not found') {
                res.status(404).json({ message: error.message });
            } else if (error.message === 'Unauthorized to delete this event') {
                res.status(403).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    static async toggleApproval(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const event = await EventController.eventService.toggleApproval(id);
            res.json({
                message: 'Event approval status updated successfully',
                data: event,
            });
        } catch (error: any) {
            if (error.message === 'Event not found') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    static async flagEvent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const event = await EventController.eventService.flagEvent(id);
            res.json({
                message: 'Event flagged successfully',
                data: event,
            });
        } catch (error: any) {
            if (error.message === 'Event not found') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }
}
