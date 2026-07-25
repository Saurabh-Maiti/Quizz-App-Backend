import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEntity } from '../../role/entities/role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  firstName!: string;

  @Column({ nullable: true })
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  hashedPassword!: string;

  @ManyToOne(() => RoleEntity, (role) => role.users, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  role!: RoleEntity;

  @Column({ default: false })
  isOnboarded!: boolean;
}
