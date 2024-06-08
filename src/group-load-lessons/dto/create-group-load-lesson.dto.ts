import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupLoadLessonDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  groupId: number;

  @ApiProperty()
  hours: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  semester: number;
}
