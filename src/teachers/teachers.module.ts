import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeachersService } from './teachers.service';
import { TeacherEntity } from './entities/teacher.entity';
import { TeachersController } from './teachers.controller';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService],
  imports: [TypeOrmModule.forFeature([TeacherEntity])],
})
export class TeachersModule {}
