import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import mongoose from 'mongoose';
import { AppModule } from '../src/app.module';

describe('SentimentController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/sentiment (POST) - 200 analyze sentiment of a text', () => {
    return request(app.getHttpServer())
      .post('/sentiment')
      .send({
        text: 'I am sitting in the morning at the diner on the corner I am waiting at the counter for the man to pour the coffee And he fills it only halfway, and before I even argue He is looking out the window at somebody coming in',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('score');
        expect(res.body).toHaveProperty('magnitude');
      });
  });

  it('/sentiment (POST) - 400 analyze sentiment of a text with missing text', () => {
    return request(app.getHttpServer()).post('/sentiment').send({}).expect(400);
  });

  it('/sentiment (POST) - 400 analyze sentiment of a text belong the required length', () => {
    return request(app.getHttpServer())
      .post('/sentiment')
      .send({ text: 'I love programming!' })
      .expect(400);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await app.close();
  });
});
