import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  BaseEntity,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  ORGANIZER = 'organizer',
}

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @Index('idx_user_name')
  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Index('idx_user_email')
  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    name: 'roles',
    type: 'enum',
    enum: UserRole,
    nullable: false,
    array: true,
    default: [UserRole.USER],
  })
  roles: UserRole[];

  @Column({
    name: 'bio',
    type: 'text',
    nullable: true,
  })
  bio?: string;

  @Column({
    name: 'verified',
    type: 'boolean',
    default: false,
  })
  verified: boolean;

  @Column({
    name: 'rt_hash',
    type: 'varchar',
    nullable: true,
    select: false,
  })
  rt_hash?: string;

  @Column({
    name: 'at_hash',
    type: 'varchar',
    nullable: true,
    select: false,
  })
  at_hash?: string;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    select: false,
  })
  deleted_at: Date;
}
