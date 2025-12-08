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

export enum EventCategory {
    TECH = 'Tech',
    MUSIC = 'Music',
    SPORTS = 'Sports',
    ART = 'Art',
    BUSINESS = 'Business',
    EDUCATION = 'Education',
    OTHER = 'Other',
}

@Entity('event')
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index('idx_event_title')
    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 500 })
    short_description: string;

    @Column({ type: 'text' })
    description: string;

    @Index('idx_event_date')
    @Column({ type: 'timestamp' })
    date: Date;

    @Column({ type: 'varchar', nullable: true })
    image_url: string;

    @Column({ type: 'varchar', nullable: true })
    video_url: string;

    @Column({ type: 'varchar' })
    location: string;

    @Index('idx_event_category')
    @Column({
        type: 'enum',
        enum: EventCategory,
        default: EventCategory.OTHER,
    })
    category: EventCategory;

    @Column({ type: 'int' })
    capacity: number;

    @Column({ type: 'int', default: 0 })
    attendees_count: number;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organizer_id' })
    organizer: User;

    @Column({ name: 'organizer_id' })
    organizer_id: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
