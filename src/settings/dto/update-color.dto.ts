import { ApiProperty } from '@nestjs/swagger';

export class UpdateColorDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  color: string;
}
