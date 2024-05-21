import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import mongoose, { Model } from 'mongoose';
import { AppModule } from '../src/app.module';
import { Sentiment } from '../src/sentiment/schemas/sentiment.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { GoogleSentimentService } from '../src/google-sentiment/google-sentiment.service';

describe('SentimentController (e2e)', () => {
  let app: INestApplication;
  let sentimentModel: Model<Sentiment>;
  let cacheService: Cache;
  let googleSentimentService: GoogleSentimentService;

  const text = `I am sitting in the morning at the diner on the corner I am waiting at the counter for the man to pour the coffee And he fills it only halfway, and before I even argue He is looking out the window at somebody coming in`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    sentimentModel = app.get<Model<Sentiment>>(getModelToken(Sentiment.name));
    cacheService = app.get<Cache>(CACHE_MANAGER);
    googleSentimentService = moduleFixture.get<GoogleSentimentService>(
      GoogleSentimentService,
    );
    await app.init();

    await sentimentModel.deleteMany({});
    await cacheService.reset();
  });

  it('/sentiment/analyze (POST) - 200 analyze sentiment of a text requesting the API', async () => {
    const dbSentimentBefore = await sentimentModel.findOne({ text });
    const cacheSentimentBefore = await cacheService.get(text);
    const spy = jest.spyOn(googleSentimentService, 'analyzeSentiment');

    expect(dbSentimentBefore).toBeNull();
    expect(cacheSentimentBefore).toBeUndefined();

    await request(app.getHttpServer())
      .post('/sentiment/analyze')
      .send({
        text,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('score');
        expect(res.body).toHaveProperty('magnitude');
      });

    const cacheSentimentAfter = await cacheService.get(text);
    const dbSentimentAfter = await sentimentModel.findOne({ text });
    expect(cacheSentimentAfter).not.toBeNull();
    expect(dbSentimentAfter).not.toBeNull();
    expect(spy).toHaveBeenCalledWith(text);
  });

  // it('/sentiment/analyze (POST) - 200 analyze sentiment of a text requesting the CACHE', async () => {
  //   await request(app.getHttpServer())
  //     .post('/sentiment/analyze')
  //     .send({
  //       text,
  //     })
  //     .expect(201)
  //     .expect((res) => {
  //       expect(res.body).toHaveProperty('score');
  //       expect(res.body).toHaveProperty('magnitude');
  //     });

  //   const dbSentimentBefore = await sentimentModel.findOne({ text });
  //   const cacheSentimentBefore = await cacheService.get(text);
  //   const spy = jest.spyOn(googleSentimentService, 'analyzeSentiment');

  //   expect(dbSentimentBefore).not.toBeNull();
  //   expect(cacheSentimentBefore).not.toBeNull();

  //   console.log('cacheSentimentBefore', cacheSentimentBefore);

  //   await request(app.getHttpServer())
  //     .post('/sentiment/analyze')
  //     .send({
  //       text,
  //     })
  //     .expect(201)
  //     .expect((res) => {
  //       expect(res.body).toHaveProperty('score');
  //       expect(res.body).toHaveProperty('magnitude');
  //     });

  //   const cacheSentimentAfter = await cacheService.get(text);
  //   const dbSentimentAfter = await sentimentModel.findOne({ text });

  //   expect(cacheSentimentAfter).not.toBeNull();
  //   expect(dbSentimentAfter).not.toBeNull();

  //   expect(spy).not.toHaveBeenCalled();
  // });

  it('/sentiment/analyze (POST) - 400 analyze sentiment of a text with missing text', () => {
    return request(app.getHttpServer())
      .post('/sentiment/analyze')
      .send({})
      .expect(400);
  });

  it('/sentiment/analyze (POST) - 400 analyze sentiment of a text belong the required length', () => {
    return request(app.getHttpServer())
      .post('/sentiment/analyze')
      .send({ text: 'I love programming!' })
      .expect(400);
  });

  afterAll(async () => {
    await sentimentModel.deleteMany({});
    await mongoose.connection.close();
    await app.close();
  });
});
