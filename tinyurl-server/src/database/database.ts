import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export const DATABASE_TOKEN = 'PG_CLIENT';

@Entity('urls')
export class URLsEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
  })
  id: string;

  @Column({
    name: 'long_url',
    type: 'varchar',
    default: '""',
  })
  longURL: string;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'last_read_at'
  })
  updatedAt: Date;
}
