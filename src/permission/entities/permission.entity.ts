import { Column, Entity } from 'typeorm';

@Entity('permissions')
export class PermissionEntity {
  @Column({ type: 'uuid', primary: true, generated: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;
}
