import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Wallet from "App/Models/Wallet";
import WalletService from 'App/Services/WalletServices';
import WalletValidator from "App/Validators/WalletValidator";

export default class WalletsController {
    public async create({request,response,auth}){
        const payload = await request.validate(WalletValidator)
        payload.owner_id = auth.user!.id
        const wallet = await Wallet.create(payload)
        return response.send(wallet)
    }

    public async view({response,auth,params}:HttpContextContract){
        const owner_id = auth.user!.id
        const payload = await WalletService.view(owner_id,params.id)
        return response.send(payload)
    }
}
