import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    BaseEntity,
    Index,
} from 'typeorm';
import { User } from './User';
import { Event } from './Event';

export enum AttendeeStatus {
    CONFIRMED = 'confirmed',
    WAITLIST = 'waitlist',
    CANCELLED = 'cancelled',
}

export enum AttendanceEnum {
    PENDING = 'Pending',
    PRESENT = 'Present',
    ABSENT = 'Absent',
}

@Entity('event_attendee')
@Index(['user_id', 'event_id'], { unique: true }) // Prevent duplicate bookings
export class EventAttendee extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int', generated: 'increment', unique: true })
    ticket_number: number;

    @Column({ name: 'user_id' })
    user_id: string;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'event_id' })
    event_id: string;

    @ManyToOne(() => Event, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @Column({
        type: 'enum',
        enum: AttendeeStatus,
        default: AttendeeStatus.CONFIRMED,
    })
    status: AttendeeStatus;

    @Column({
        type: 'enum',
        enum: AttendanceEnum,
        default: AttendanceEnum.PENDING,
    })
    attendance: AttendanceEnum;

    @Column({ type: 'int', nullable: true })
    waitlist_position: number | null;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
