import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { TeacherEntity } from 'src/teachers/entities/teacher.entity';
import { ChangeStudentsCountDto } from './dto/change-students-count.dto';
import { GroupLoadLessonEntity } from './entities/group-load-lesson.entity';
import { CreateGroupLoadLessonDto } from './dto/create-group-load-lesson.dto';
import { ChangeStudentsCountByNameAndTypeDto } from './dto/change-students-count-by-name-and-type.dto';

@Injectable()
export class GroupLoadLessonsService {
  constructor(
    @InjectRepository(GroupLoadLessonEntity)
    private groupLoadLessonsRepository: Repository<GroupLoadLessonEntity>,

    @InjectRepository(TeacherEntity)
    private teacherRepository: Repository<TeacherEntity>,
  ) {}

  async findOneLessonById(id: number) {
    const lesson = await this.groupLoadLessonsRepository.findOne({
      where: { id },
      relations: {
        teacher: true,
        group: true,
      },
      select: {
        teacher: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
        },
        group: { id: true, name: true },
      },
    });

    if (!lesson) throw new NotFoundException('Дисципліну не знайдено');

    return lesson;
  }

  async create(dto: CreateGroupLoadLessonDto) {
    try {
      const { groupId, ...rest } = dto;

      const payload = this.groupLoadLessonsRepository.create({
        ...rest,
        group: { id: groupId },
      });
      const newLesson = await this.groupLoadLessonsRepository.save(payload);
      return newLesson;
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException('Помилка при створенні навантаження групи');
    }
  }

  async findAllByGroupId(groupId: number) {
    const lessons = await this.groupLoadLessonsRepository.find({
      where: { group: { id: groupId } },
      relations: {
        group: true,
        teacher: true,
      },
      select: {
        group: { id: true, name: true },
        teacher: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
        },
      },
    });

    if (!lessons.length) throw new NotFoundException('Дисципліни не знайдені');

    return lessons;
  }

  async findLessonsForSchedule(semester: number, scheduleType: 'group' | 'teacher', itemId: number) {
    if (scheduleType === 'group') {
      const lessons = await this.groupLoadLessonsRepository.find({
        where: {
          group: { id: itemId },
          semester,
          teacher: Not(IsNull()),
        },
        relations: {
          group: true,
          teacher: true,
        },
        select: {
          group: { id: true, name: true },
          teacher: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      });

      if (!lessons.length) throw new NotFoundException('Дисципліни не знайдені');

      return lessons;
    } else if (scheduleType === 'teacher') {
      const lessons = await this.groupLoadLessonsRepository.find({
        where: {
          semester,
          teacher: { id: itemId },
        },
        relations: {
          group: true,
          teacher: true,
        },
        select: {
          group: { id: true, name: true },
          teacher: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      });

      if (!lessons.length) throw new NotFoundException('Дисципліни не знайдені');

      return lessons;
    } else {
      return [];
    }
  }

  async removeByGroupId(groupId: number) {
    await this.groupLoadLessonsRepository.delete({
      group: { id: groupId },
    });
    return true;
  }

  async changeAllStudentsCount(dto: ChangeStudentsCountDto) {
    await this.groupLoadLessonsRepository.update(
      {
        group: { id: dto.id },
      },
      { students: Number(dto.students) },
    );
  }

  async changeStudentsCountByNameAndType(dto: ChangeStudentsCountByNameAndTypeDto) {
    await this.groupLoadLessonsRepository.update(
      {
        group: { id: dto.id },
        type: dto.type,
        name: dto.name,
        semester: Number(dto.semester),
      },
      { students: Number(dto.students) },
    );

    return dto;
  }

  /* teacher */
  async attachTeacher(lessonId: number, teacherId: number) {
    const lesson = await this.findOneLessonById(lessonId);

    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
    });

    if (!teacher) throw new BadRequestException('Викладача не знайдено!');
    await this.groupLoadLessonsRepository.save({
      ...lesson,
      teacher: { id: teacherId },
    });

    return { lessonId, teacher };
  }

  async unpinTeacher(lessonId: number) {
    const lesson = await this.findOneLessonById(lessonId);
    await this.groupLoadLessonsRepository.save({ ...lesson, teacher: null });
    return { lessonId };
  }
}
