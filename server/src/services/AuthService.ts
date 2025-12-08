import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserService } from './UserService';
import { hashSHA256 } from '../utils/hash';
import { UserRole } from '../entities/User';

export class AuthService {
  private userService = new UserService();
  private googleClient = new OAuth2Client(config.google.clientId);

  async googleLogin(idToken: string, res: Response) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: config.google.clientId,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new Error('Invalid Google Token');
    }

    let user = await this.userService.getUser({ email: payload.email });

    if (!user) {
      user = await this.userService.createUser({
        name: payload.name || 'User',
        email: payload.email,
      });
    } else {
      // Update name if changed? Optional.
    }

    const tokens = this.signPayload({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });

    await this.userService.setTokenHash( //  to use it it invalidate existing token once redis is implemented.
      user.id,
      hashSHA256(tokens.accessToken, config.jwt.accessSecret),
      hashSHA256(tokens.refreshToken, config.jwt.refreshSecret)
    );

    this.setCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }

  async refreshTokens(refreshToken: string, res: Response) {
    let payload: any;
    try {
      payload = jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch (e) {
      throw new Error('Invalid Refresh Token....');
    }

    const user = await this.userService.getUser({ id: payload.id, include_refresh_token_hash: true });
    if (!user || !user.rt_hash) {
      throw new Error('User not found or access denied');
    }

    const incomingHash = hashSHA256(refreshToken, config.jwt.refreshSecret);
    if (incomingHash !== user.rt_hash) {
      throw new Error('Invalid Refresh Token');
    }

    const tokens = this.signPayload({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });

    await this.userService.setTokenHash(
      user.id,
      hashSHA256(tokens.accessToken, config.jwt.accessSecret),
      hashSHA256(tokens.refreshToken, config.jwt.refreshSecret)
    );

    this.setCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }

  private signPayload(payload: any) {
    const accessToken = jwt.sign(payload, config.jwt.accessSecret as jwt.Secret, {
      expiresIn: config.jwt.accessExpiresIn,
    } as jwt.SignOptions);
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret as jwt.Secret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = config.nodeEnv === 'production';

    res.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      domain: isProduction ? new URL(config.frontendHost).hostname : undefined,
    });

    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      domain: isProduction ? new URL(config.frontendHost).hostname : undefined,
    });
  }

  async registerOrganizer(idToken: string, bio: string, res: Response) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: config.google.clientId,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new Error('Invalid Google Token');
    }

    let user = await this.userService.getUser({ email: payload.email });

    if (user) {
      throw new Error('User already exists');
    }

    user = await this.userService.createUser({
      name: payload.name || 'Organizer',
      email: payload.email,
      roles: [UserRole.ORGANIZER],
      bio,
      verified: false,
    });

    const tokens = this.signPayload({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });

    await this.userService.setTokenHash(
      user.id,
      hashSHA256(tokens.accessToken, config.jwt.accessSecret),
      hashSHA256(tokens.refreshToken, config.jwt.refreshSecret)
    );

    this.setCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }
}
