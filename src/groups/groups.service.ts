import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { GroupEntity } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupLoadLessonsService } from './../group-load-lessons/group-load-lessons.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupsRepository: Repository<GroupEntity>,

    private groupLoadLessonsService: GroupLoadLessonsService,
  ) {}

  async findOne(id: number) {
    const group = await this.groupsRepository.findOne({
      where: { id },
      relations: {
        category: true,
        lessons: {
          group: true,
          teacher: true,
        },
      },
      select: {
        category: { id: true, name: true },
        lessons: {
          id: true,
          name: true,
          semester: true,
          type: true,
          hours: true,
          group: { id: true, name: true },
          teacher: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
    });

    if (!group) throw new NotFoundException('Групу не знайдено');
    return group;
  }

  async create(dto: CreateGroupDto) {
    const { category, educationPlan, ...rest } = dto;

    const newGroup = this.groupsRepository.create({
      ...rest,
      category: { id: category },
    });

    const group = await this.groupsRepository.save(newGroup);

    return group;
  }

  async update(id: number, dto: UpdateGroupDto) {
    const group = await this.groupsRepository.findOne({
      where: { id },
    });

    if (!group) throw new NotFoundException('Групу не знайдено');

    // Якщо при оновленні було змінено кількість студентів
    if (Number(group.students) !== Number(dto.students)) {
      await this.groupLoadLessonsService.changeAllStudentsCount({
        id,
        students: dto.students,
      });
    }

    const { category, educationPlan, ...rest } = dto;

    return this.groupsRepository.save({
      ...group,
      ...rest,
      category: { id: category },
    });
  }

  // Коли видаляється група - видаляються такод всі group-load-lessons які були в цієї групи
  async remove(id: number) {
    const res = await this.groupsRepository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException('Групу не знайдено');
    }

    await this.groupLoadLessonsService.removeByGroupId(id);

    return id;
  }
}
