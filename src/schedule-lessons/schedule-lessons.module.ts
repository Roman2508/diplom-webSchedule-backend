import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupEntity } from 'src/groups/entities/group.entity';
import { ScheduleLessonsService } from './schedule-lessons.service';
import { SettingsEntity } from 'src/settings/entities/setting.entity';
import { ScheduleLessonsController } from './schedule-lessons.controller';
import { ScheduleLessonsEntity } from './entities/schedule-lesson.entity';

@Module({
  controllers: [ScheduleLessonsController],
  providers: [ScheduleLessonsService],
  imports: [TypeOrmModule.forFeature([ScheduleLessonsEntity, SettingsEntity, GroupEntity])],
})
export class ScheduleLessonsModule {}
