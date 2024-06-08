import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleLessonDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  lessonNumber: number;

  @ApiProperty()
  semester: number;

  @ApiProperty()
  type: 'ЛК' | 'ПЗ' | 'ЛАБ' | 'СЕМ' | 'ЕКЗ';

  @ApiProperty()
  students: number;

  @ApiProperty()
  hours: number;

  @ApiProperty()
  isRemote?: boolean;

  @ApiProperty()
  group: number;

  @ApiProperty()
  teacher: number;

  @ApiProperty()
  auditory?: number;
}
