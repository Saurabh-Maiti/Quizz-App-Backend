import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      username: 'saurabhmaiti',
      password: 'Saurabhmaiti@5934',
      database: 'quizappbackend',
      host: 'localhost',
      port: 5432,
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    RoleModule,
    EmailModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
