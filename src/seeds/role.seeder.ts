import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { RoleEntity } from '../role/entities/role.entity';
import { RoleName } from '../role/enum/roleName.enum';

async function seedRoles() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const roleRepository = app.get<Repository<RoleEntity>>(
    getRepositoryToken(RoleEntity),
  );

  const roles = [RoleName.STUDENT, RoleName.TEACHER, RoleName.ADMIN];

  for (const name of roles) {
    const existingRole = await roleRepository.findOne({ where: { name } });

    if (!existingRole) {
      await roleRepository.save(roleRepository.create({ name }));
      console.log(`Created role: ${name}`);
    } else {
      console.log(`Role already exists: ${name}`);
    }
  }

  await app.close();
}

seedRoles().catch((error) => {
  console.error('Failed to seed roles', error);
  process.exit(1);
});
