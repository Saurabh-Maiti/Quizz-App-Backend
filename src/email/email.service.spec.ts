import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  const configService = {
    get: jest.fn((key: string, defaultValue?: string) => {
      const values: Record<string, string> = {
        GMAIL_USER: 'test@gmail.com',
        GMAIL_APP_PASSWORD: 'test-password',
        MAIL_FROM: 'Quiz App <test@gmail.com>',
      };

      return values[key] ?? defaultValue;
    }),
    getOrThrow: jest.fn((key: string) => {
      const values: Record<string, string> = {
        GMAIL_USER: 'test@gmail.com',
        GMAIL_APP_PASSWORD: 'test-password',
      };

      return values[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
