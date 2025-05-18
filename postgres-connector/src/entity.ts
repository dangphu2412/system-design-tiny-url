import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posts') // Specifies the table name as 'posts'
export class PostEntity {
  @PrimaryGeneratedColumn('uuid') // Auto-generates a UUID for the primary key
  id: string;

  @Column({ length: 255 }) // Standard column for the title
  title: string;

  @Column({ type: 'text' }) // Column for longer content, maps to TEXT type in Postgres
  content: string;

  @CreateDateColumn({ type: 'timestamp with time zone' }) // Automatically set on creation
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' }) // Automatically set on creation and update
  updatedAt: Date;
}
