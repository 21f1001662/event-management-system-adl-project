import { Request, Response } from 'express';
import { StorageService } from '../services/StorageService';

export class StorageController {
    private static storageService = new StorageService();

    static async getPresignedUrl(req: Request, res: Response) {
        try {
            const { content_type } = req.query;

            if (!content_type || typeof content_type !== 'string') {
                return res.status(400).json({ message: 'content_type query parameter is required' });
            }

            const result = await StorageController.storageService.generatePresignedUrl(content_type);

            res.json({
                message: 'Presigned URL generated successfully',
                data: result,
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
