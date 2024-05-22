import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('serveStaticHtml', () => {
    it('should send the static html file', () => {
      const res = {
        sendFile: jest.fn(),
      };
      appController.serveStaticHtml(res as any);
      expect(res.sendFile).toHaveBeenCalledWith(
        expect.stringContaining('index.html'),
      );
    });
  });
});
