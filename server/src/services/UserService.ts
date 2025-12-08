import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';
import { addOrdering, addPagination } from '../utils/query.utils';

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

  async createUser(data: {
    name: string;
    email: string;
    roles?: UserRole[];
    bio?: string;
    verified?: boolean;
  }) {
    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      roles: data.roles || [UserRole.USER],
      bio: data.bio,
      verified: data.verified || false,
    });
    return await this.userRepository.save(user);
  }

  async getAllUsers(filters: any) {
    const { page = 1, limit = 10, search, role, orderBy, order } = filters;
    const skip = (page - 1) * limit;

    let qb = this.userRepository.createQueryBuilder('user');

    if (search) {
      qb.andWhere('user.name ILIKE :search OR user.email ILIKE :search', { search: `%${search}%` });
    }

    if (role) {
      qb.andWhere(':role = ANY(user.roles)', { role });
    }

    qb = addOrdering(qb, orderBy || 'created_at', order || 'DESC');
    qb = addPagination(qb, limit, skip);

    const [users, total] = await qb.getManyAndCount();

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async verifyOrganizer(userId: string) {
    const user = await this.getUser({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.roles.includes(UserRole.ORGANIZER)) {
      throw new Error('User is not an organizer');
    }

    user.verified = !user.verified;
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
