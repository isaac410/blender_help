import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('blender_help')
export class BlenderHelp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 150 })
  shortcut: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 100, default: '4.2 LTS' })
  blenderVersion: string;

  @Column({ type: 'varchar', length: 100, default: 'Object Mode' })
  mode: string;

  @Column({ type: 'varchar', length: 100, default: 'General' })
  category: string;

  @Column({ type: 'simple-array' })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  tip?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
