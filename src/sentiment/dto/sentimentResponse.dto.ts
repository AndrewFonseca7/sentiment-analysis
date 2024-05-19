import { ApiProperty } from '@nestjs/swagger';

export class SentimentResponseDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  magnitude: number;

  @ApiProperty()
  score: number;
}
