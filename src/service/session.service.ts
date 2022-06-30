import SessionModel from "../models/session.model";

export async function createSession(userId: string,userAgente:string) {
  const session = await SessionModel.create({ user: userId, userAgente })
  return session.toJSON()
  
}