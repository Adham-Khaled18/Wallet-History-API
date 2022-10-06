import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Transaction from './Transaction'
import Wallet from './Wallet'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public phone: string

  @column()
  public email: string

  @column()
  public name: string

  @column({serializeAs:null})
  public password: string

  @beforeSave()
  public static async hashPassword(user: User){
    if(user.$dirty.password){
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(()=>Transaction,{
    foreignKey:'owner_id'
  })
  public transactions: HasMany<typeof Transaction>

  @hasMany(()=>Wallet,{
    foreignKey:'owner_id'
  })
  public wallets: HasMany<typeof Wallet>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
