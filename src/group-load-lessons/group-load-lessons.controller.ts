import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Get, Post, Body, Patch, Param, UseGuards, Controller } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GroupLoadLessonsService } from './group-load-lessons.service';
import { CreateGroupLoadLessonDto } from './dto/create-group-load-lesson.dto';
import { ChangeStudentsCountByNameAndTypeDto } from './dto/change-students-count-by-name-and-type.dto';

@Controller('group-load-lessons')
@ApiTags('group-load-lessons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GroupLoadLessonsController {
  constructor(private readonly groupLoadLessonsService: GroupLoadLessonsService) {}

  @ApiBody({ type: CreateGroupLoadLessonDto })
  @Post()
  create(@Body() dto: CreateGroupLoadLessonDto) {
    return this.groupLoadLessonsService.create(dto);
  }

  @Get(':id')
  findAllByGroupId(@Param('id') id: string) {
    return this.groupLoadLessonsService.findAllByGroupId(+id);
  }

  @Get('/:semester/:scheduleType/:itemId')
  findLessonsForSchedule(
    @Param('semester') semester: string,
    @Param('scheduleType') scheduleType: 'group' | 'teacher',
    @Param('itemId') itemId: string,
  ) {
    return this.groupLoadLessonsService.findLessonsForSchedule(+semester, scheduleType, +itemId);
  }

  @ApiBody({ type: ChangeStudentsCountByNameAndTypeDto })
  @Patch('/students')
  updateStudents(@Body() dto: ChangeStudentsCountByNameAndTypeDto) {
    return this.groupLoadLessonsService.changeStudentsCountByNameAndType(dto);
  }

  @Patch('attach-teacher/:lessonId/:teacherId')
  attachTeacher(@Param('lessonId') lessonId: string, @Param('teacherId') teacherId: string) {
    return this.groupLoadLessonsService.attachTeacher(+lessonId, +teacherId);
  }

  @Patch('unpin-teacher/:lessonId')
  unpinTeacher(@Param('lessonId') lessonId: string) {
    return this.groupLoadLessonsService.unpinTeacher(+lessonId);
  }
}
