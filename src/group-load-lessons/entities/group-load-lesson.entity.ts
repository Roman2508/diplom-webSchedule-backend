import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import { GroupEntity } from 'src/groups/entities/group.entity';
import { TeacherEntity } from 'src/teachers/entities/teacher.entity';

@Entity('group-load-lessons')
export class GroupLoadLessonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => GroupEntity, (group) => group.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group' })
  group: GroupEntity;

  @ManyToOne(() => TeacherEntity, (teacher) => teacher.lessons, { nullable: true })
  @JoinColumn({ name: 'teacher' })
  teacher: TeacherEntity;

  @Column()
  semester: number;

  @Column()
  type: string;

  @Column()
  hours: number;

  @Column({ default: 1 })
  students: number;
}
