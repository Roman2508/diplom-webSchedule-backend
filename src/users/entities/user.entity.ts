import { TeacherCategoryEntity } from 'src/teacher-categories/entities/teacher-category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  password: string;

  @Column({ default: 'admin' })
  access: 'super_admin' | 'admin' | 'deans_office' | 'department_chair';

  @Column()
  email: string;

  @ManyToOne(() => TeacherCategoryEntity, (category) => category.teachers, { nullable: true })
  department: TeacherCategoryEntity | null;
}
