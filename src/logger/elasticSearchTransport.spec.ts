import { Client } from '@elastic/elasticsearch';
import ElasticSearchTransport from './elasticSearchTransport';
import Logger from './logger';

jest.mock('@elastic/elasticsearch');

describe('ElasticSearchTransport', () => {
  let mockClient: jest.Mocked<Client>;
  let transport: ElasticSearchTransport;

  beforeEach(() => {
    mockClient = new Client({
      node: 'http://localhost:9200',
    }) as jest.Mocked<Client>;
    transport = new ElasticSearchTransport({
      elasticsearchHost: 'http://localhost:9200',
    });
    transport.client = mockClient;
  });

  it('should create an instance of ElasticSearchTransport', () => {
    expect(transport).toBeInstanceOf(ElasticSearchTransport);
    expect(transport.client).toBeDefined();
  });

  it('should log info and call client.index with correct parameters', (done) => {
    const info = { message: 'Test log message', level: 'info' };
    const callback = jest.fn();

    mockClient.index.mockImplementation();

    transport.log(info, callback);

    expect(mockClient.index).toHaveBeenCalledWith({
      index: 'sentiment-logs',
      body: {
        '@timestamp': expect.any(Date),
        level: info.level,
        message: info.message,
        service: 'sentiment-analysis',
        environment: process.env.NODE_ENV,
        requestID: undefined,
        userID: undefined,
        errorStack: null,
      },
    });

    process.nextTick(() => {
      expect(callback).toHaveBeenCalled();
      done();
    });
  });

  it('should emit logged event', (done) => {
    const info = { message: 'Test log message', level: 'info' };
    const callback = jest.fn();

    transport.on('logged', (loggedInfo) => {
      expect(loggedInfo).toEqual(info);
      done();
    });

    mockClient.index.mockImplementation();

    transport.log(info, callback);
  });

  it('should handle logger errors', (done) => {
    const error = new Error('Test error');
    const errorHandlerSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    Logger.emit('error', error);

    process.nextTick(() => {
      expect(errorHandlerSpy).toHaveBeenCalledWith('Error in logger:', error);
      done();
    });
  });
});
