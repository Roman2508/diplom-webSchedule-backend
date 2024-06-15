import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Get, Post, Body, Patch, Param, Delete, UseGuards, Controller } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { TeacherCategoriesService } from './teacher-categories.service';
import { CreateTeacherCategoryDto } from './dto/create-teacher-category.dto';
import { UpdateTeacherCategoryDto } from './dto/update-teacher-category.dto';

@Controller('teacher-categories')
@ApiTags('teacher-categories')
export class TeacherCategoriesController {
  constructor(private readonly teacherCategoriesService: TeacherCategoriesService) {}

  @Get('')
  findAll() {
    return this.teacherCategoriesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreateTeacherCategoryDto })
  @Post()
  create(@Body() dto: CreateTeacherCategoryDto) {
    return this.teacherCategoriesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeacherCategoryDto) {
    return this.teacherCategoriesService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherCategoriesService.remove(+id);
  }
}
