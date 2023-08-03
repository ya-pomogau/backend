import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  fullname: string;

  @Column({ type: 'varchar', nullable: false })
  role: string;

  @Column({ type: 'varchar', nullable: false,})
  vk: string;

  @Column({ type: 'varchar', nullable: false,})
  photo: string;

  @Column({ type: 'varchar', nullable: false })
  phone: string;

  @Column({ type: 'varchar', nullable: false })
  address: string;

  @Column({ type: 'float', array: true, nullable: false })
  coordinates: number[];

  @Column({ type: 'boolean', nullable: true, default: null })
  approved: boolean;

  @Column({ type: 'varchar', nullable: true, default: null })
  adminStatus: string;
}
