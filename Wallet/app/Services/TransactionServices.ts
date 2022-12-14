import Transaction from "App/Models/Transaction"
import Wallet from "App/Models/Wallet"
import { DateTime } from "luxon"


class TransactionService {


    public static async UpdateTransaction(id, update) {
        const transaction = await Transaction
            .query()
            .where('id', id)
            .first()
        transaction!.amount = update.amount
        if (update.type == 'income') {
            transaction
            transaction!.category = update.category!
        }
        transaction!.wallet_id = update.wallet_id
        await transaction!.save()
        
        return transaction!
    }

    public static async DeleteTransaction(id, owner_id) {
        // const transaction = await Transaction
        // .query()
        // .where('id',id)
        // .andWhereIn('wallet_id',(query)=>query
        // .from('wallets')
        // .select('id')
        // .where('owner_id',owner_id))
        // .delete()
        // return transaction[0].wallet_id
        const wall_id = await Transaction
        .query()
        .where('id', id)
        .andWhereIn('wallet_id', (query)=> query.from('wallets').select('id').where('owner_id',owner_id))
        .firstOrFail()
            
            
     
       await Transaction
        .query()
        .where('id', id)
        .andWhereIn('wallet_id', (query)=> query.from('wallets').select('id').where('owner_id',owner_id))
        .delete()
        return wall_id.wallet_id
     }

    public static async ShowTen(owner_id) {
        const transaction = await Transaction
            .query()
            .where('owner_id', owner_id)
            .limit(10)
        return transaction
    }

    public static async ShowTime(owner_id, id) {
        switch (id) {
            case "Today":
                const today = await Transaction
                    .query()
                    .select()
                    .where('created_at', '>=', DateTime.local().startOf('day').toSQLDate())
                    .andWhere('owner_id', owner_id)
                return today
            case "Week":
                const week = await Transaction
                    .query()
                    .where('created_at', '>=', DateTime.local().startOf('week').toSQLDate())
                    .andWhere('owner_id', owner_id)
                return week

            case "Month":
                const month = await Transaction
                    .query()
                    .where('created_at', '>=', DateTime.local().startOf('month').toSQLDate())
                    .andWhere('owner_id', owner_id)
                return month

            default:
                return null
        }

    }

    public static async ShowAnalytic(owner_id, payload) {
        // if (payload.type == 'expenses') {
        //     return await Transaction
        //         .query()
        //         .where('type', payload.type)
        //         .andWhere('owner_id', owner_id)
        //         .andWhereBetween('created_at', [payload.from, payload.to])
        // }
        // else {
        //     return await Transaction
        //         .query()
        //         .where('type', payload.type)
        //         .andWhere('category', payload.category)
        //         .andWhere('owner_id', owner_id)
        //         .andWhereBetween('created_at', [payload.from, payload.to])
        // }
        // return Transaction
        //         .query()
        //         .where('type', payload.type)
        //         .if(payload.type == 'income', query => {
        //             query.andWhere('category', payload.category)
        //         })
        //         .andWhere('owner_id', owner_id)
        //         .andWhereBetween('created_at', [payload.from, payload.to])
        const transactionQuery = Transaction
        .query()
        .where('type', payload.type)
        .andWhere('owner_id', owner_id)
        .andWhereBetween('created_at', [payload.from, payload.to])
        if(payload.type == 'income'){
            transactionQuery.andWhere('category', payload.category)
        }
        return transactionQuery
    }

    public static async CalculateBalance(owner_id,wallet_id) {
        const transaction = await Wallet
            .query()
            .where('id',wallet_id)
            .withAggregate('transactions',(query)=>{
                query.sum('amount').as('total').where('wallet_id', wallet_id).andWhere('owner_id',owner_id)

            })
            var total = transaction[0].$extras.total
            if (total == null) {
                total = 0
            }
            await this.UpdateBalance(wallet_id,total)
         
    }

    public static async UpdateBalance(wallet_id,total){
        const wallet = await Wallet
        .query()
        .where('id',wallet_id)
        .firstOrFail()
        wallet.balance = total
        await wallet.save()
    }

    public static async ProcessAmount(payload) {
        if (payload.type == 'expenses') {
            payload.amount = payload.amount * -1
        }
        return payload
    }
}



export default TransactionService