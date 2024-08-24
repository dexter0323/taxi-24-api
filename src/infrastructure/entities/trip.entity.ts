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

  @ManyToOne(() => Passenger, passenger => passenger.trips)
  passenger: Passenger;

  @ManyToOne(() => Driver, driver => driver.trips)
  driver: Driver;

  @Column('decimal', { precision: 10, scale: 7 })
  start_latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  start_longitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  end_latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  end_longitude: number;

  @CreateDateColumn()
  start_time: Date;

  @UpdateDateColumn()
  end_time: Date;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
