import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Sentiment extends Document {
  @ApiProperty({ description: 'The ID of the sentiment analysis' })
  id: string;

  @Prop()
  @Prop({ required: true })
  @ApiProperty({ description: 'The analyzed text' })
  text: string;

  @Prop()
  @Prop({ required: true })
  @ApiProperty({ description: 'The score of the sentiment analysis' })
  score: number;

  @Prop()
  @Prop({ required: true })
  @ApiProperty({ description: 'The magnitude of the sentiment analysis' })
  magnitude: number;
}

export const SentimentSchema = SchemaFactory.createForClass(Sentiment);
