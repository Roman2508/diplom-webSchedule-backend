import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { customDayjs } from 'src/utils/customDayjs';
import { SettingsEntity } from 'src/settings/entities/setting.entity';
import { CopyDayOfScheduleDto } from './dto/copy-day-of-schedule.dto';
import { CopyWeekOfScheduleDto } from './dto/copy-week-of-schedule.dto';
import { ScheduleLessonsEntity } from './entities/schedule-lesson.entity';
import { CreateScheduleLessonDto } from './dto/create-schedule-lesson.dto';
import { UpdateScheduleLessonDto } from './dto/update-schedule-lesson.dto';

@Injectable()
export class ScheduleLessonsService {
  constructor(
    @InjectRepository(ScheduleLessonsEntity)
    private repository: Repository<ScheduleLessonsEntity>,

    @InjectRepository(SettingsEntity)
    private settingsRepository: Repository<SettingsEntity>,
  ) {}

  async findOneByDateAndGroup(
    date: Date,
    lessonNumber: number,
    semester: number,
    groupId: number,
    type: 'ЛК' | 'ПЗ' | 'ЛАБ' | 'СЕМ' | 'ЕКЗ',
  ) {
    return this.repository.findOne({
      where: { date, lessonNumber, semester, type, group: { id: groupId } },
      relations: {
        group: true,
        teacher: true,
        auditory: true,
      },
      select: {
        group: { id: true, name: true },
        teacher: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
        },
        auditory: { id: true, name: true },
      },
    });
  }

  async findByTypeIdAndSemester(type: string, id: number, semesterStart?: string, semesterEnd?: string) {
    const start = semesterStart && customDayjs(semesterStart, 'MM.DD.YYYY').toDate();
    const end = semesterEnd && customDayjs(semesterEnd, 'MM.DD.YYYY').toDate();
    const date = start && end ? Between(start, end) : undefined;

    return this.repository.find({
      where: {
        [type]: { id },
        // semester: semester ? semester : undefined,
        date,
      },
      relations: {
        group: true,
        teacher: true,
        auditory: true,
      },
      select: {
        group: { id: true, name: true },
        teacher: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
        },
        auditory: { id: true, name: true },
      },
    });
  }

  async create(dto: CreateScheduleLessonDto) {
    // Спочатку треба перевірити чи в цей час та дату для цієї групи немає виставлених занять
    const lessonsOverlay = await this.repository.findOne({
      where: {
        date: dto.date,
        lessonNumber: dto.lessonNumber,
        semester: dto.semester,
        teacher: { id: dto.teacher },
      },
    });

    if (lessonsOverlay) {
      throw new BadRequestException('Можливі накладки занять');
    }

    // Перевіряю чи правильно передані дані
    // Має бути id аудиторії і isRemote: false АБО isRemote: true без id аудиторії
    if (!dto.auditory && !dto.isRemote) {
      throw new BadRequestException('Аудиторію не вибрано');
    }

    if (dto.auditory && dto.isRemote) {
      throw new BadRequestException('Урок який буде проводитись дистанційно не повинен займати аудиторію');
    }

    const { group, teacher, auditory, ...rest } = dto;

    const payload = this.repository.create({
      ...rest,
      group: { id: group },
      teacher: { id: teacher },
    });

    if (auditory) {
      // Якщо урок буде проводитись НЕ дистанційно
      const newLesson = this.repository.create({
        ...payload,
        auditory: { id: auditory },
      });

      await this.repository.save(newLesson);
    } else {
      // Якщо урок буде проводитись дистанційно
      const newLesson = this.repository.create(payload);
      await this.repository.save(newLesson);
    }

    const newLesson = await this.findOneByDateAndGroup(dto.date, dto.lessonNumber, dto.semester, dto.group, dto.type);

    return newLesson;
  }

  async copyWeekOfSchedule(dto: CopyWeekOfScheduleDto) {
    const copyFromStart = customDayjs(dto.copyFromStartDay, { format: 'MM.DD.YYYY' });
    const copyFromEnd = customDayjs(copyFromStart).add(7, 'day');

    const copyToStart = customDayjs(dto.copyToStartDay, { format: 'MM.DD.YYYY' });

    if (!copyFromStart.isValid() || !copyToStart.isValid) {
      throw new BadRequestException('Не вірний формат дати');
    }

    const weekDifference = copyToStart.diff(copyFromStart, 'week');

    const lessons = await this.findByTypeIdAndSemester(
      'group',
      dto.groupId,
      copyFromStart.toString(),
      copyFromEnd.toString(),
    );

    if (!lessons.length) {
      return [];
    }

    const createdLessons = [];

    await Promise.all(
      lessons.map(async (lesson) => {
        const date = customDayjs(lesson.date, { format: 'MM.DD.YYYY' }).add(weekDifference, 'week').toDate();

        const { id, group, teacher, auditory, ...rest } = lesson;

        const newLesson = await this.create({
          ...rest,
          group: group.id,
          teacher: teacher.id,
          auditory: auditory.id,
          date,
        });

        createdLessons.push(newLesson);
      }),
    );

    return createdLessons;
  }

  async copyDayOfSchedule(dto: CopyDayOfScheduleDto) {
    const copyFromStart = customDayjs(dto.copyFromDay, { format: 'YYYY.MM.DD' });

    const copyTo = customDayjs(dto.copyToDay, { format: 'MM.DD.YYYY' });

    if (!copyFromStart.isValid() || !copyTo.isValid) {
      throw new BadRequestException('Не вірний формат дати');
    }

    const daysDifference = copyTo.diff(copyFromStart, 'day');

    const lessons = await this.findByTypeIdAndSemester(
      'group',
      dto.groupId,
      copyFromStart.toString(),
      copyFromStart.toString(),
    );

    if (!lessons.length) {
      return [];
    }

    const createdLessons = [];

    await Promise.all(
      lessons.map(async (lesson) => {
        const date = customDayjs(lesson.date, { format: 'MM.DD.YYYY' }).add(daysDifference, 'day').toDate();

        const { id, group, teacher, auditory, ...rest } = lesson;

        const newLesson = await this.create({
          ...rest,
          group: group.id,
          teacher: teacher.id,
          auditory: auditory.id,
          date,
        });

        createdLessons.push(newLesson);
      }),
    );

    return createdLessons;
  }

  async findAll(semester: number, type: string, id: number) {
    // dto: {type: 'group' | 'teacher' | 'auditory', id: ід групи, викладача або аудиторії, semester: номер семестру }

    const settings = await this.settingsRepository.findOne({
      where: { id: 1 },
    });
    if (!settings) throw new NotFoundException('Settings was not found');

    if (type === 'group' || type === 'teacher' || type === 'auditory') {
      // semester = 1 | 2
      const { firstSemesterStart, secondSemesterStart, firstSemesterEnd, secondSemesterEnd } = settings;

      const semesterStart = semester === 1 ? firstSemesterStart : secondSemesterStart;
      const semesterEnd = semester === 1 ? firstSemesterEnd : secondSemesterEnd;

      const data = await this.findByTypeIdAndSemester(type, id, semesterStart, semesterEnd);

      return data;
    }
  }

  async findForView(semester: number, teacherId: number, groupId: number) {
    // dto: {type: 'group' | 'teacher' | 'auditory', id: ід групи, викладача або аудиторії, semester: номер семестру }

    const settings = await this.settingsRepository.findOne({
      where: { id: 1 },
    });
    if (!settings) throw new NotFoundException('Settings was not found');

    // semester = 1 | 2
    const { firstSemesterStart, secondSemesterStart, firstSemesterEnd, secondSemesterEnd } = settings;

    const semesterStart = semester === 1 ? firstSemesterStart : secondSemesterStart;
    const semesterEnd = semester === 1 ? firstSemesterEnd : secondSemesterEnd;

    const start = semesterStart && customDayjs(semesterStart, 'MM.DD.YYYY').toDate();
    const end = semesterEnd && customDayjs(semesterEnd, 'MM.DD.YYYY').toDate();
    const date = start && end ? Between(start, end) : undefined;

    const teacher = teacherId ? { id: teacherId } : undefined;
    const group = groupId ? { id: groupId } : undefined;

    return this.repository.find({
      where: {
        teacher,
        group,
        date,
      },
      relations: {
        group: true,
        teacher: true,
        auditory: true,
      },
      select: {
        group: { id: true, name: true },
        teacher: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
        },
        auditory: { id: true, name: true },
      },
    });
  }

  // Оновити аудиторію для виставленого елемента розкладу
  async update(id: number, dto: UpdateScheduleLessonDto) {
    const lesson = await this.repository.findOne({
      where: { id },
      relations: {
        auditory: true,
        group: true,
        teacher: true,
      },
      select: {
        auditory: { id: true, name: true },
        teacher: {
          id: true,
          firstName: true,
          lastName: true,
          middleName: true,
        },
        group: { id: true, name: true },
      },
    });

    if (!lesson) throw new NotFoundException('Не знайдено');

    // Перевіряю чи правильно передані дані
    // Має бути id аудиторії і isRemote: false АБО isRemote: true без id аудиторії
    if (!dto.auditoryId && !dto.isRemote) {
      throw new BadRequestException('Аудиторію не вибрано');
    }
    if (dto.auditoryId && dto.isRemote) {
      throw new BadRequestException('Урок який буде проводитись дистанційно не повинен займати аудиторію');
    }

    // Якщо група не об'єднана в потік
    const { auditory, isRemote, ...rest } = lesson;

    // Якщо дисципліна читається аудиторно
    if (dto.auditoryId) {
      return this.repository.save({
        ...rest,
        isRemote: dto.isRemote,
        auditory: {
          id: dto.auditoryId,
          name: dto.auditoryName,
          seatsNumber: dto.seatsNumber,
        },
      });
    } else {
      // Якщо дисципліна читається дистанційно
      return this.repository.save({
        ...rest,
        isRemote: dto.isRemote,
        auditory: null,
      });
    }
  }

  async getAuditoryOverlay(_date: string, lessonNumber: number, auditoryId: number) {
    if (!customDayjs(_date).isValid()) {
      throw new BadRequestException('Не вірний формат дати');
    }

    const date = customDayjs(_date, 'YYYY.MM.DD').format('YYYY-MM-DD 00:00:00');

    const lessons = await this.repository.find({
      // @ts-ignore
      where: { date, lessonNumber },
      relations: { auditory: true },
      select: { auditory: { id: true, name: true } },
    });

    const auditories = lessons.map((el) => el.auditory);

    return auditories.filter((el) => {
      // !el === дистанційно
      if (!el) return true;
      return el.id !== auditoryId;
    });
  }

  async remove(id: number) {
    const lesson = await this.repository.findOne({
      where: { id },
      relations: {
        group: true,
        teacher: true,
        auditory: true,
      },
      select: {
        teacher: { id: true },
        group: { id: true, name: true },
        auditory: { id: true, name: true },
      },
    });

    if (!lesson) throw new NotFoundException('Не знайдено');

    const res = await this.repository.delete({ id });

    if (res.affected === 0) {
      throw new NotFoundException('Не знайдено');
    }

    return id;
  }
}
