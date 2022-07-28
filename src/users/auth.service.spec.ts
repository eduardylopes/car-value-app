import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

let service: AuthService;
let fakeUsersService: Partial<UsersService>;

describe('AuthService', () => {
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const user = users.filter((user) => user.email === email);
        return Promise.resolve(user);
      },

      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should be able to create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('should be able to create a new user with a salted and hashed password', async () => {
    const user = await service.signup('techiv@vijcim.ye', '2297666720');

    expect(user.password).not.toEqual('2297666720');
    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw an error if the user signs up with an email that in use', async () => {
    const user = {
      id: 1,
      email: 'uwmuvri@je.lu',
      password: '1757775963',
    };

    await service.signup(user.email, user.password);

    await expect(
      service.signup(user.email, user.password),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should throw an error if signin is called with an unused email', async () => {
    await expect(
      service.signin('ga@da.ky', '3001233432'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should throw an error if an invalid password is provided', async () => {
    const user = {
      id: 28,
      email: 'horhica@ira.sh',
      password: '982311583',
    };

    await fakeUsersService.create(user.email, user.password);

    await expect(
      service.signin(user.email, 'wrong_password0203012'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should return a user if the password is correct', async () => {
    const userMock = {
      email: 'abol@uberu.mu',
      password: '2420615491',
    };

    await service.signup(userMock.email, userMock.password);

    const user = await service.signin(userMock.email, userMock.password);

    expect(user).toBeDefined();
    expect(user).toHaveProperty('email', userMock.email);
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('password');
  });
});
