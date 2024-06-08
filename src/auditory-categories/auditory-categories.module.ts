import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditoryCategoriesService } from './auditory-categories.service';
import { AuditoryCategoryEntity } from './entities/auditory-category.entity';
import { AuditoryCategoriesController } from './auditory-categories.controller';

@Module({
  controllers: [AuditoryCategoriesController],
  providers: [AuditoryCategoriesService],
  imports: [TypeOrmModule.forFeature([AuditoryCategoryEntity])],
})
export class AuditoryCategoriesModule {}
