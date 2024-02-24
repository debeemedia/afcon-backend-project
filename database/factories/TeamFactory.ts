import Team from 'App/Models/Team'
import Factory from '@ioc:Adonis/Lucid/Factory'

const TeamFactory = Factory.define(Team, ({ faker }) => {
  return {
    //
    country: faker.unique(() => faker.address.country())

  }
}).build()

export default TeamFactory