import { Request, Response } from 'express'
import  config  from 'config'
import { createSession } from '../service/session.service'
import { validatePassword } from '../service/user.service'
import { signJwt } from '../utils/jwt.utils'

export async function createUserSessionHandler(req:Request, res:Response) {
  //validar senha
  const user = await validatePassword(req.body)
  if (!user) {
    return res.status(401).send("Invalid credentials")
  }
  //create session
  const session = await createSession(user._id,req.get("user-agent")||"")
  //create token
  const acessToken = signJwt(
    {...user,session:session._id},{expiresIn:config.get('accessTplemTtl')} //15min
  )
  //refresh token
  const refreshToken = signJwt(
    {...user,session:session._id},{expiresIn:config.get('accessTplemTtl')} //15min
  )
  //return acess & ref token
  return res.send({acessToken,refreshToken})
  
}
export async function getUserSessionHandler(req:Request, res:Response) {
  
}