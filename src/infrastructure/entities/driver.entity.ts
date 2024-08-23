import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DriverStatus } from 'src/domain/model/driver';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: DriverStatus,
    default: DriverStatus.UNAVAILABLE,
  })
  status: DriverStatus;

  @Column('decimal', { precision: 10, scale: 7, default: 0 })
  longitude: number;

  @Column('decimal', { precision: 10, scale: 7, default: 0 })
  latitude: number;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
