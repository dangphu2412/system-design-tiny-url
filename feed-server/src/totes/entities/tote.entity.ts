import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('totes')
export class ToteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'varchar',
  })
  material: string;

  @Column({
    type: 'varchar',
  })
  size: string;

  @Column({
    type: 'varchar',
  })
  color: string;

  @Column({
    type: 'float',
    nullable: true,
  })
  rating: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  isNewArrival: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isBestSeller: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  inStock: boolean;

  @Column({
    type: 'simple-json',
    nullable: false,
  })
  style: string[];

  @Column({
    type: 'float',
    default: 0,
  })
  price: number;

  @Column({
    type: 'varchar',
    default: '""',
  })
  bannerURL: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
