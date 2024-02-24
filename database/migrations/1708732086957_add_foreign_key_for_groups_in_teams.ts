import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'teams'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('group_id').after('nickname').references('id').inTable('groups').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('group_id')
    })
  }
}
