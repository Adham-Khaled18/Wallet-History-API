import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from "App/Models/Transaction";
import TransactionService from 'App/Services/TransactionServices';
import AddTransactionValidator from "App/Validators/AddTransactionValidator";
import AnalyticValidator from 'App/Validators/AnalyticValidator';
import UpdateTransactionValidator from 'App/Validators/UpdateTransactionValidator';

export default class TransactionsController {
    public async addTransaction({ request, response, auth }) {
        const payload = await request.validate(AddTransactionValidator)
        payload.owner_id = await auth.user!.id
        const processed = await TransactionService.ProcessAmount(payload)
        const transaction = await Transaction.create(processed)
        await TransactionService.CalculateBalance(payload.owner_id, payload.wallet_id)
        return response.send(transaction)

    }
    public async updateTransaction({ request, response, auth, params }: HttpContextContract) {
        const owner_id = auth.user!.id
        const update = await request.validate(UpdateTransactionValidator)
        const transaction: Transaction = await TransactionService.UpdateTransaction(params.id, owner_id, update)
        await TransactionService.CalculateBalance(owner_id, update.wallet_id)
        return response.send(transaction)
    }

    public async deleteTransaction({ response, auth, params }: HttpContextContract) {
        const owner_id = auth.user!.id
        const deleted = await TransactionService.DeleteTransaction(params.id, owner_id)
        await TransactionService.CalculateBalance(owner_id, deleted)
        return response.send('deleted!')
    }

    public async view({ response, auth }: HttpContextContract) {
        const owner_id = auth.user!.id
        const payload = await TransactionService.ShowTen(owner_id)
        return response.send(payload)

    }

    public async viewTime({ response, auth, params }: HttpContextContract) {
        const owner_id = auth.user!.id
        const payload = await TransactionService.ShowTime(owner_id, params.id)
        response.send(payload)
    }

    public async analytic({ request, response, auth }: HttpContextContract) {
        const owner_id = auth.user!.id
        const payload = await request.validate(AnalyticValidator)
        const result = await TransactionService.ShowAnalytic(owner_id, payload)
        return response.send(result)
    }
}
