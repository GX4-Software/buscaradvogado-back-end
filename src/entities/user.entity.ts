import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import { Sessions } from './session.entity';

export enum USER_ROLE {
  OWNER,
  SUPER_ADMIN,
  ADMIN,
  CLIENT,
}

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string = `usr_${createId()}`;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column()
  cpf: string;

  @Column()
  rg: string;

  @Column({ name: 'birth_date' })
  birthDate: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column({ name: 'proof_of_address' })
  proofOfAddress: string;

  @Column({ name: 'email_verified' })
  emailVerified: boolean = false;

  @Column({
    type: 'enum',
    enum: USER_ROLE,
    default: USER_ROLE.CLIENT,
  })
  role: USER_ROLE;

  @OneToMany(() => Sessions, (sessions) => sessions.user)
  sessions: Sessions[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
