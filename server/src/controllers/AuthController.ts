import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

import { GoogleLoginDto, RefreshTokenDto } from '../dtos/auth.dto';

export class AuthController {
  private static authService = new AuthService();

  static async login(req: Request, res: Response) {
    try {
      const { id_token } = req.body as GoogleLoginDto;
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
      const body = req.body as RefreshTokenDto;
      const refreshToken = req.cookies?.Refresh || body.refresh_token;
      console.log("monkey")
      console.log(refreshToken);
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
