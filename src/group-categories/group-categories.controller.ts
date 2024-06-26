import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GroupCategoriesService } from './group-categories.service';
import { CreateGroupCategoryDto } from './dto/create-group-category.dto';
import { UpdateGroupCategoryDto } from './dto/update-group-category.dto';

@Controller('group-categories')
@ApiTags('group-categories')
export class GroupCategoriesController {
  constructor(private readonly groupCategoriesService: GroupCategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreateGroupCategoryDto) {
    return this.groupCategoriesService.create(dto);
  }

  @Get('')
  findAll() {
    return this.groupCategoriesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGroupCategoryDto) {
    return this.groupCategoriesService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupCategoriesService.remove(+id);
  }
}
