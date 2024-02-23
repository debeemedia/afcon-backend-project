import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Group from 'App/Models/Group'
import { GroupFactory } from 'Database/factories'

test.group('Groups show', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('fetch a group', async ({client, assert, route}) => {
    await Group.query().delete()

    const group = await GroupFactory.create()

    const response = await client.get(route('GroupsController.show', {id: group.id}))
    const responseBody = response.body()

    // response.dumpBody()

    response.assertStatus(200)
    response.assertBodyContains(
      {
        data: {
          id: group.id,
          name: group.name
        }
      }
    )

    const fetchedGroup = await Group.findOrFail(group.id)
    assert.equal(responseBody.data.id, fetchedGroup.id)
    assert.equal(responseBody.data.name, fetchedGroup.name)
  })
  // .pin()
})
