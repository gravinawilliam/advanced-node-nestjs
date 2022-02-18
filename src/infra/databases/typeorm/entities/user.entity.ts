import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'usuarios' })
export class UserEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ nullable: true, name: 'nome' })
  name?: string;

  @Column({ name: 'email' })
  email!: string;

  @Column({ nullable: true, name: 'id_facebook' })
  facebookId!: string;
}
