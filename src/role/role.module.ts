import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleEntity } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([RoleEntity])],
  providers: [RoleService]
})
export class RoleModule {}
