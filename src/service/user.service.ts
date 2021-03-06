import { DocumentDefinition ,FilterQuery} from 'mongoose'
import {omit} from 'lodash'
import UserModel, { UserDocument } from '../models/user.model';

export async function createUser (input: DocumentDefinition<Omit<UserDocument,'createdAt' | 'updateAt'| 'comparePassword'>>) {
  try {
    const user = await UserModel.create(input)
 
    // const userObject = omit(user.toJSON(), "password")
    //  console.log("response user",userObject)
    return user
  } catch (e:any) {
    throw new Error(e)
  }
}

export async function validatePassword({email,password}:{email:string,password:string}) {
  const user = await UserModel.findOne({ email })
  if (!user) {
    return false
  }
  const isValid = await user.comparePassword(password)
  if (!isValid) return false
  return omit(user.toJSON(),["password","__v"])
}

export async function findUser(query : FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean()
}
