import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthService from "App/Services/AuthServices";
import SignupValidator from "App/Validators/SignupValidator";
import User from 'App/Models/User';
import LoginValidator from 'App/Validators/LoginValidator';
import Mail from '@ioc:Adonis/Addons/Mail'

export default class UsersController {


    public async signup({ request, response }: HttpContextContract) {
        const payload = await request.validate(SignupValidator)
        const user = await User.create(payload)

        //verify email
        Mail.send((message) => {
            message
              .from('verify@adonisgram.com')
              .to(user.email)
              .subject('Verify Email')
              .htmlView('emails/verify', { user })
          })

        return response.send(user)
    }

    public async login({ request, response, auth }: HttpContextContract) {
        const { uid, password } = await request.validate(LoginValidator)
        const user = await AuthService.FindByUser(uid)
        if (!user) response.send('User not found!')
        const { type, token } = await auth.attempt(uid, password)
        return response.send({ ...{ type, token }, user })
    }
}
