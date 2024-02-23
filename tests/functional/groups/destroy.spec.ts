import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Group from 'App/Models/Group'
import { GroupFactory } from 'Database/factories'

test.group('Groups destroy', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('delete a group', async ({client, assert, route}) => {
    await Group.query().delete()

    const group = await GroupFactory.create()

    const response = await client.delete(route('GroupsController.destroy', {id: group.id}))

    // response.dumpBody()
    response.assertStatus(200)
    response.assertBodyContains(
      { message: 'Group was deleted', data: group.id }
    )

    const deletedGroup = await Group.find(group.id)
    assert.notExists(deletedGroup)
  })
  // .pin()

})
