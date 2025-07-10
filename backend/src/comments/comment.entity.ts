    import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Tree,
    TreeChildren,
    TreeParent,
    CreateDateColumn,
    UpdateDateColumn,
    } from 'typeorm';
    import { User } from '../users/user.entity';

    @Tree('closure-table')
    @Entity('comments')
    export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.comments, { eager: true })
    author: User;

    @TreeChildren()
    replies: Comment[];

    @TreeParent()
    parent: Comment;

    @Column('text')
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    deletedUntil: Date | null;
    }
