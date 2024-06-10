import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Get, Post, Body, Patch, Param, UseGuards, Controller, Delete } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GroupLoadLessonsService } from './group-load-lessons.service';
import { CreateGroupLoadLessonDto } from './dto/create-group-load-lesson.dto';
import { UpdateGroupLoadLessonDto } from './dto/update-group-load-lesson.dto';

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

  @ApiBody({ type: UpdateGroupLoadLessonDto })
  @Patch()
  update(@Body() dto: UpdateGroupLoadLessonDto) {
    return this.groupLoadLessonsService.update(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.groupLoadLessonsService.delete(id);
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

  @Patch('attach-teacher/:lessonId/:teacherId')
  attachTeacher(@Param('lessonId') lessonId: string, @Param('teacherId') teacherId: string) {
    return this.groupLoadLessonsService.attachTeacher(+lessonId, +teacherId);
  }

  @Patch('unpin-teacher/:lessonId')
  unpinTeacher(@Param('lessonId') lessonId: string) {
    return this.groupLoadLessonsService.unpinTeacher(+lessonId);
  }
}
