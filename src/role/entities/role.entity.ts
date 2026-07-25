import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { RoleName } from '../enum/roleName.enum';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryColumn({
    type: 'uuid',
    primary: true,
    default: () => 'uuid_generate_v4()',
  })
  id!: string;
  @Column({ enum: RoleName, unique: true })
  name!: RoleName;
  @OneToMany(() => UserEntity, (user) => user.role, {
    onDelete: 'CASCADE',
  })
  users!: UserEntity;
}
