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

@Entity('review')
@Index(['user_id', 'event_id'], { unique: true }) // One review per user per event
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    review_text: string;

    @Column({ type: 'int' })
    rating: number;

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

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
