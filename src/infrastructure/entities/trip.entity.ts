import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Driver } from './driver.entity';
import { Passenger } from './passenger.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Passenger, passenger => passenger.trips, { nullable: false })
  passenger: Passenger;

  @ManyToOne(() => Driver, driver => driver.trips, { nullable: false })
  driver: Driver;

  @Column('decimal', { precision: 10, scale: 7 })
  start_latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  start_longitude: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  end_latitude: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  end_longitude: number;

  @Column({ type: 'timestamp', nullable: true })
  start_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_time: Date;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
