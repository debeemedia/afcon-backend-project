import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Group from 'App/Models/Group'
import { GroupFactory } from 'Database/factories'

test.group('Groups index', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  
  test('fetch list of groups', async ({client, assert, route}) => {

    await Group.query().delete()

    await GroupFactory.createMany(5)

    const response = await client.get(route('GroupsController.index'))
    const responseBody = response.body()

    // response.dumpBody()
    response.assertStatus(200)
    assert.equal(responseBody.data.length, 5)

  })
  // .pin()
})
