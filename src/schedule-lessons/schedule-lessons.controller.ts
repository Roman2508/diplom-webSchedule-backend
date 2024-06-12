import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Get, Post, Body, Patch, Param, Delete, UseGuards, Controller } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CopyWeekOfScheduleDto } from './dto/copy-week-of-schedule.dto';
import { ScheduleLessonsService } from './schedule-lessons.service';
import { CreateScheduleLessonDto } from './dto/create-schedule-lesson.dto';
import { UpdateScheduleLessonDto } from './dto/update-schedule-lesson.dto';
import { CopyDayOfScheduleDto } from './dto/copy-day-of-schedule.dto';
import { CreateReplacementDto } from './dto/create-replacement.dto';

@Controller('schedule-lessons')
@ApiTags('schedule-lessons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScheduleLessonsController {
  constructor(private readonly scheduleLessonsService: ScheduleLessonsService) {}

  @ApiBody({ type: CreateScheduleLessonDto })
  @Post()
  create(@Body() dto: CreateScheduleLessonDto) {
    return this.scheduleLessonsService.create(dto);
  }

  @Get('overlay/:date/:lessonNumber/:auditoryId')
  getAuditoryOverlay(
    @Param('date') date: string,
    @Param('lessonNumber') lessonNumber: string,
    @Param('auditoryId') auditoryId: string,
  ) {
    return this.scheduleLessonsService.getAuditoryOverlay(date, +lessonNumber, +auditoryId);
  }

  @Get('view/:semester/:teacher/:group')
  findForView(@Param('semester') semester: string, @Param('teacher') teacher: string, @Param('group') group: string) {
    return this.scheduleLessonsService.findForView(+semester, +teacher, +group);
  }

  @Get(':semester/:type/:id')
  findAll(@Param('semester') semester: string, @Param('type') type: string, @Param('id') id: string) {
    return this.scheduleLessonsService.findAll(+semester, type, +id);
  }

  @ApiBody({ type: CopyWeekOfScheduleDto })
  @Post('/copy-week')
  copyWeekOfSchedule(@Body() dto: CopyWeekOfScheduleDto) {
    return this.scheduleLessonsService.copyWeekOfSchedule(dto);
  }

  @ApiBody({ type: CopyDayOfScheduleDto })
  @Post('/copy-day')
  copyDayOfSchedule(@Body() dto: CopyDayOfScheduleDto) {
    return this.scheduleLessonsService.copyDayOfSchedule(dto);
  }

  @ApiBody({ type: UpdateScheduleLessonDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateScheduleLessonDto) {
    return this.scheduleLessonsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleLessonsService.remove(+id);
  }
}
