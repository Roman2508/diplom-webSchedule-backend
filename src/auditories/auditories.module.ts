import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditoriesService } from './auditories.service';
import { AuditoryEntity } from './entities/auditory.entity';
import { AuditoriesController } from './auditories.controller';

@Module({
  controllers: [AuditoriesController],
  providers: [AuditoriesService],
  imports: [TypeOrmModule.forFeature([AuditoryEntity])],
})
export class AuditoriesModule {}
