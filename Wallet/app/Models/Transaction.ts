import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Wallet from './Wallet'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public amount: number

  @column()
  public owner_id: number

  @column()
  public wallet_id: number

  @column()
  public category: string

  @belongsTo(()=>User,{
    localKey: 'owner_id'
  })
  public user : BelongsTo<typeof User>

  @belongsTo(()=>Wallet,{
    localKey: 'wallet_id'
  })
  public wallet : BelongsTo<typeof Wallet>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
