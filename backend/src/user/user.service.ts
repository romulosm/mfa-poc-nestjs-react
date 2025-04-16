import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { id } });
  }

  async create(user: Partial<User>): Promise<Partial<User> & User> {
    return await this.userRepo.save(user);
  }

  async enableMfa(userId: string, secret: string): Promise<UpdateResult> {
    return await this.userRepo.update(userId, {
      mfaEnabled: true,
      mfaSecret: secret,
    });
  }

  async updateSecret(userId: string, secret: string): Promise<void> {
    await this.userRepo.update(userId, { mfaSecret: secret });
  }
}
