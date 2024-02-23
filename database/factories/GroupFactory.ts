import Group from 'App/Models/Group'
import Factory from '@ioc:Adonis/Lucid/Factory'

const GroupFactory = Factory.define(Group, ({ faker }) => {
  return {
    //
    name: faker.company.companyName()

  }
}).build()

export default GroupFactory