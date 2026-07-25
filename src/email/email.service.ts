import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

type SendMailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.getOrThrow<string>('GMAIL_USER'),
        pass: this.configService.getOrThrow<string>('GMAIL_APP_PASSWORD'),
      },
    });
  }

  async sendMail(options: SendMailOptions) {
    return this.transporter.sendMail({
      from: this.configService.get<string>(
        'MAIL_FROM',
        this.configService.getOrThrow<string>('GMAIL_USER'),
      ),
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}
