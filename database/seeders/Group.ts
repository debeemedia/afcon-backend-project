import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { GroupFactory } from 'Database/factories'

export default class GroupSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await GroupFactory.createMany(10)
  }
}
