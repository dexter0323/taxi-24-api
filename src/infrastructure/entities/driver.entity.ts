import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column('varchar')
  status: string;

  @Column('varchar')
  location: string;

  @CreateDateColumn({ name: 'createdate' })
  created_date: Date;

  @UpdateDateColumn({ name: 'updateddate' })
  updated_date: Date;
}
