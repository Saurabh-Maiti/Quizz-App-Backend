import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEntity } from '../../role/entities/role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  hashedPassword!: string;

  @ManyToOne(() => RoleEntity, (role) => role.users, {
    nullable: false,
  })
  role!: RoleEntity;
}
