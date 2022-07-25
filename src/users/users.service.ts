import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(email: string, password: string) {
    const userAlreadyExists = await this.userRepository.findOneBy({ email });

    if (userAlreadyExists) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }

    const user = this.userRepository.create({ email, password });

    await this.userRepository.save(user);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async find(email: string) {
    return await this.userRepository.findBy({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(user, attrs);

    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    return this.userRepository.remove(user);
  }
}
