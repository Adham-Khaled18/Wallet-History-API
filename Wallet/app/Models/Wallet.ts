import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Transaction from './Transaction'

export default class Wallet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public owner_id:number

  @column()
  public name:string

  @column()
  public currency:string

  @column()
  public balance:number

  @belongsTo(()=>User,{
    localKey:'owner_id'
  })
  public user:BelongsTo<typeof User>

  @hasMany(()=>Transaction,{
    foreignKey:'wallet_id'
  })
  public transactions: HasMany<typeof Transaction>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
