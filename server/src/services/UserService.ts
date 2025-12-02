import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getUser(query: { id?: string; email?: string; include_refresh_token_hash?: boolean }) {
    const qb = this.userRepository.createQueryBuilder('user');

    if (query.id) qb.andWhere('user.id = :id', { id: query.id });
    if (query.email) qb.andWhere('user.email = :email', { email: query.email });
    if (query.include_refresh_token_hash) qb.addSelect('user.rt_hash');

    const user = await qb.getOne();
    return user;
  }

  async createUser(data: { name: string; email: string }) {
    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      roles: [UserRole.USER],
    });
    return await this.userRepository.save(user);
  }

  async updateUser(id: string, data: { name?: string; email?: string }) {
    await this.userRepository.update(id, data);
    return await this.getUser({ id });
  }

  async setTokenHash(userId: string, atHash: string, rtHash: string) {
    await this.userRepository.update(userId, {
      at_hash: atHash,
      rt_hash: rtHash,
    });
  }
}
