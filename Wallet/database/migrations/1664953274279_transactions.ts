import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().unique().primary().unsigned()
      table.enu('type',['expenses','income']).notNullable()
      table.decimal('amount').notNullable()
      table.string('category').nullable()
      table.integer('owner_id').notNullable().unsigned()
      table.foreign('owner_id').references('users.id')
      table.integer('wallet_id').notNullable().unsigned()
      table.foreign('wallet_id').references('wallets.id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
