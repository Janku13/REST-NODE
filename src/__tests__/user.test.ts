import mongoose from 'mongoose';
import supertesst from 'supertest';
import createServer from '../utils/server';
import * as UserService from '../service/user.service';
import * as SessionService from '../service/Session.service';
import { createUserSessionHandler } from '../controller/session.controller';

const app = createServer();
const userId = new mongoose.Types.ObjectId().toString();
export const userPayload = {
  _id: userId,
  email: 'moham@gmail.com',
  name: 'moham',
};
const userInput = {
  email: 'teste@gmail.com',
  name: 'teste',
  password: 'teste123',
  passwordConfirmation: 'teste123',
};
const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.28.4",
  createdAt: new Date("2021-09-30T13:31:07.674Z"),
  updatedAt: new Date("2021-09-30T13:31:07.674Z"),
  __v: 0,
};

describe('user', () => {
  //user registration
  describe('user registration', () => {
    //user name and password are validated
    describe('given the username and password are valid', () => {
      it('should return the user payload', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          .mockReturnValueOnce(userPayload);
        const { statusCode, body } = await supertesst(app)
          .post('/api/users')
          .send(userInput);
        expect(statusCode).toBe(200);
        expect(body).toEqual(userPayload);
        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });
    //verify that the passwords must match
    describe('given the passwords do not match', () => {
      it('should return a 400', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          .mockReturnValueOnce(userPayload);
        const { statusCode } = await supertesst(app)
          .post('/api/users')
          .send({...userInput,passwordConfirmation:"does not match"});
        expect(statusCode).toBe(400);
        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    // verify error handle
    describe('given the user service erros', () => {
      it('should return 409 error', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          .mockRejectedValue('rejected');
        const { statusCode } = await supertesst(app)
          .post('/api/users')
          .send(userInput);
        expect(statusCode).toBe(409);
        expect(createUserServiceMock).toHaveBeenCalled()
      });
  });
  //create a user session
  describe('create user session', () => {
    //a user can login with email and password
    describe('given the username and password are valid', () => {
      it('should return a signed accessToken and refreshToken', async () => {
        jest.spyOn(UserService, 'validatePassword').mockReturnValue(userPayload)
        jest.spyOn(SessionService, 'createSession').mockReturnValue(sessionPayload)
        const req = {
          get: () => {
            return 'a user agente '
          },
          body: {
            email: 'test@example.com',
            password:"Password123"
          }
        }
        const send = jest.fn()
        const res = {
          send
        }
        await createUserSessionHandler(req, res)
        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        })
      });
    });
  });
});
