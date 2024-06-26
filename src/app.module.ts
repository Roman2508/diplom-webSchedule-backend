import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { UserEntity } from './users/entities/user.entity';
import { TeachersModule } from './teachers/teachers.module';
import { SettingsModule } from './settings/settings.module';
import { GroupEntity } from './groups/entities/group.entity';
import { AuditoriesModule } from './auditories/auditories.module';
import { TeacherEntity } from './teachers/entities/teacher.entity';
import { SettingsEntity } from './settings/entities/setting.entity';
import { AuditoryEntity } from './auditories/entities/auditory.entity';
import { GroupCategoriesModule } from './group-categories/group-categories.module';
import { ScheduleLessonsModule } from './schedule-lessons/schedule-lessons.module';
import { GroupCategoryEntity } from './group-categories/entities/group-category.entity';
import { GroupLoadLessonsModule } from './group-load-lessons/group-load-lessons.module';
import { TeacherCategoriesModule } from './teacher-categories/teacher-categories.module';
import { ScheduleLessonsEntity } from './schedule-lessons/entities/schedule-lesson.entity';
import { AuditoryCategoriesModule } from './auditory-categories/auditory-categories.module';
import { TeacherCategoryEntity } from './teacher-categories/entities/teacher-category.entity';
import { GroupLoadLessonEntity } from './group-load-lessons/entities/group-load-lesson.entity';
import { AuditoryCategoryEntity } from './auditory-categories/entities/auditory-category.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        UserEntity,
        GroupEntity,
        TeacherEntity,
        AuditoryEntity,
        SettingsEntity,
        GroupCategoryEntity,
        TeacherCategoryEntity,
        GroupLoadLessonEntity,
        ScheduleLessonsEntity,
        AuditoryCategoryEntity,
      ],
      extra: {
        max: 1, // set pool max size
      },
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    GroupsModule,
    TeachersModule,
    SettingsModule,
    AuditoriesModule,
    GroupCategoriesModule,
    ScheduleLessonsModule,
    GroupLoadLessonsModule,
    TeacherCategoriesModule,
    AuditoryCategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
