import { ApiProperty } from '@nestjs/swagger';

export class ChangeStudentsCountByNameAndTypeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  students: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  semester: number;

  @ApiProperty()
  subgroupNumber: number | null;

  @ApiProperty()
  specialization: string | null;
}
