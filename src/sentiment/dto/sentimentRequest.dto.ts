import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SentimentRequestDto {
  @IsNotEmpty()
  @IsString()
  @Length(50, 1200)
  text: string;
}
