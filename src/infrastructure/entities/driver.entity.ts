import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Trip } from './trip.entity';

import { DriverStatus } from 'src/domain/model/driver';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: Remove this column after implement trip entity repository
  @Column({
    type: 'enum',
    enum: DriverStatus,
    default: DriverStatus.UNAVAILABLE,
  })
  status: DriverStatus;

  @Column('decimal', { precision: 10, scale: 7, default: 0 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7, default: 0 })
  longitude: number;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @OneToMany(() => Trip, trip => trip.driver)
  trips: Trip[];
}
