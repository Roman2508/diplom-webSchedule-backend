import { ApiProperty } from '@nestjs/swagger';

export class UpdateGroupLoadLessonDto {
  @ApiProperty()
  lessonId: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  semester: number;

  @ApiProperty()
  hours: number;
}
