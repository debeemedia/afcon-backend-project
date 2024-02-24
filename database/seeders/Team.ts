import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { TeamFactory } from 'Database/factories'

export default class TeamSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await TeamFactory.createMany(10)

  }
}
