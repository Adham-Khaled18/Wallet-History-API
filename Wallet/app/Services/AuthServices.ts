import User from "App/Models/User"
import Mail from '@ioc:Adonis/Addons/Mail'
import {nanoid} from 'nanoid'
import Env from '@ioc:Adonis/Core/Env'
import { DateTime } from "luxon"



class AuthService {
    public static async FindByUser(uid) {
        return await User
            .query()
            .where('email', uid)
            .orWhere('phone', uid)
    }

    public static async SendEmail(user,session){
        const token = nanoid()
        await session.put(`token-${user.id}`,token)
        await session.commit()
        const url = `${Env.get('APP_URL')}/confirm-email/${user.id}/${token}`
        Mail.send((message) => {
            message
              .from('adham@mrkhalednasr.com')
              .to(user.email)
              .subject('Verify Email')
              .htmlView('emails/verify', { user ,url})
          })
    }

    public static async VerifyEmail(user_id,token,session){
        const user = await User.findOrFail(user_id)
        const sessionToken = await session.get(`token-${user_id}`)
        console.log(session.all())
        if(sessionToken === token){
            user.email_verified_at = DateTime.local()
            user.save()
            session.forget(`token-${user.id}`)
            return true
        }else{
            return false
        }
    }
}
export default AuthService