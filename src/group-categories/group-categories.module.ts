import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupCategoriesService } from './group-categories.service';
import { GroupCategoryEntity } from './entities/group-category.entity';
import { GroupCategoriesController } from './group-categories.controller';

@Module({
  controllers: [GroupCategoriesController],
  providers: [GroupCategoriesService],
  imports: [TypeOrmModule.forFeature([GroupCategoryEntity])],
})
export class GroupCategoriesModule {}
