import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthService from "App/Services/AuthServices";
import SignupValidator from "App/Validators/SignupValidator";
import User from 'App/Models/User';
import LoginValidator from 'App/Validators/LoginValidator';



export default class UsersController {


    public async signup({ request, response}: HttpContextContract) {
        const payload = await request.validate(SignupValidator)
        const user = await User.create(payload)

        //verify email
        AuthService.SendEmail(user)

        return response.send(user)
    }

    public async login({ request, response, auth }: HttpContextContract) {
        const { uid, password } = await request.validate(LoginValidator)
        const user = await AuthService.FindByUser(uid)
        if (user) response.send('User not found!')
        const { type, token } = await auth.attempt(uid, password)
        if (user.email_verified_at == null) {
            return response.send('Please verify your email')
        }
        return response.send({ ...{ type, token }, user })
    }

    public async verify({request, response,params}:HttpContextContract){
        
        
        if(request.hasValidSignature()){
            await AuthService.VerifyEmail(params.email)
            return response.send('Verified!')
        }else{
            return response.send('invalid!')
        }
        
    }
        
}
