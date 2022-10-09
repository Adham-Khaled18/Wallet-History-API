import User from "App/Models/User"
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import { DateTime } from "luxon"
import Route from '@ioc:Adonis/Core/Route'



class AuthService {
    public static async FindByUser(uid) {
        return await User
            .query()
            .where('email', uid)
            .orWhere('phone', uid)
            .firstOrFail()
    }

    public static async SendEmail(user){
        
        const url = Env.get('APP_URL')+ Route.makeSignedUrl('verifyEmail',{params:{email:user.email},expiresIn:'30m'})
        Mail.send((message) => {
            message
              .from('adham@mrkhalednasr.com')
              .to(user.email)
              .subject('Verify Email')
              .htmlView('emails/verify', { user ,url})
          })
    }

    public static async VerifyEmail(email){
        const user = await User.findByOrFail('email',email)
            user.email_verified_at = DateTime.local()
            user.save()
    }
}
export default AuthService