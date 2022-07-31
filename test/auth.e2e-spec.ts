import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request)', async () => {
    const user = {
      email: 'uwehu@goza.dj',
      password: '2316461261',
    };

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(user.email);
      });
  });

  // it('should not be able to signup if the given email is already in use', async () => {
  //   const user = {
  //     email: 'uwehu@goza.dj',
  //     password: '2316461261',
  //   };

  //   await request(app.getHttpServer())
  //     .post('/auth/signup')
  //     .send(user)
  //     .expect(201)
  //     .then((res) => {
  //       const { id, email } = res.body;
  //       expect(id).toBeDefined();
  //       expect(email).toEqual(user.email);
  //     });

  //   return request(app.getHttpServer())
  //     .post('/auth/signup')
  //     .send(user)
  //     .expect(400);
  // });
});
