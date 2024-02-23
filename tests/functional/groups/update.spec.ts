import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Group from 'App/Models/Group'
import { GroupFactory } from 'Database/factories'

test.group('Groups update', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('update a group', async ({client, assert, route}) => {
    await Group.query().delete()

    const group = await GroupFactory.create()
    const newName = 'Group F'

    const response = await client.put(route('GroupsController.update', {id: group.id}))
    .form({
      ...group,
      name: newName
    })
    const responseBody = response.body()

    // response.dumpBody()

    response.assertStatus(200)
    response.assertBodyContains(
      {
        message: 'Group was edited',
        data: {
          id: group.id,
          name: newName
        }
      }
    )

    const updatedGroup = await Group.findOrFail(group.id)
    assert.equal(updatedGroup.name, responseBody.data.name)
  })
  // .pin()

})
