import Group from 'App/Models/Group'
import Factory from '@ioc:Adonis/Lucid/Factory'

const GroupFactory = Factory.define(Group, ({ faker }) => {
  return {
    //
    name: faker.unique(() => faker.lorem.word(7))
  }
}).build()

export default GroupFactory