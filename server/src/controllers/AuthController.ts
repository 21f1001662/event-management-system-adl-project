import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private static authService = new AuthService();

  static async login(req: Request, res: Response) {
    try {
      const { id_token } = req.body;
      const result = await AuthController.authService.googleLogin(id_token, res);
      res.json({
        message: 'Login successful',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.Refresh || req.body.refresh_token;
      if (!refreshToken) {
        throw new Error('Refresh token is required');
      }
      const result = await AuthController.authService.refreshTokens(refreshToken, res);
      res.json({
        message: 'Tokens refreshed successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}
