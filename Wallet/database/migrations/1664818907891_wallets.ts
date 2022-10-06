import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'wallets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unique().notNullable().primary().unsigned()
      table.integer('owner_id').notNullable().unsigned()
      table.foreign('owner_id').references('users.id')
      table.string('name').notNullable()
      table.decimal('balance').notNullable().defaultTo(0)
      table.string('currency').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
