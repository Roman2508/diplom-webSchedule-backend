import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Get, Post, Body, Patch, Param, Delete, UseGuards, Controller } from '@nestjs/common';

import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teachers')
@ApiTags('teacher')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  findAll() {
    return this.teachersService.findAll();
  }

  @ApiBody({ type: CreateTeacherDto })
  @Post()
  create(@Body() dto: CreateTeacherDto) {
    return this.teachersService.create(dto);
  }

  @ApiBody({ type: UpdateTeacherDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.teachersService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachersService.remove(+id);
  }
}
