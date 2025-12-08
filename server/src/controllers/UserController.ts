import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private static userService = new UserService();

  static async getOwnProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const user = await UserController.userService.getUser({ id: userId });
      res.json({
        message: 'User profile retrieved successfully',
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const filters = req.query;
      const result = await UserController.userService.getAllUsers(filters);
      res.json({
        message: 'Users retrieved successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async verifyOrganizer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserController.userService.verifyOrganizer(id);
      res.json({
        message: 'Organizer verified successfully',
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
