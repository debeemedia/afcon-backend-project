import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Group from 'App/Models/Group'
import Team from 'App/Models/Team'
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

  test('show that deleting a group will delete teams belonging to it', async ({client, assert, route}) => {
    await Group.query().delete()
    await Team.query().delete()

    const group = await Group.create({
      name: 'Group A'
    })

    await Team.create({
      country: 'Nigeria',
      groupId: group.id
    })

    await Team.create({
      country: 'Equatorial Guinea',
      groupId: group.id
    })

    // control group
    const controlGroup = await Group.create({
      name: 'Group B'
    })
    const teamBelongingToControlGroup = await Team.create({
      country: 'Ghana',
      nickname: 'Black Stars',
      groupId: controlGroup.id
    })

    await Team.query().delete().where('groupId', group.id)
    const teamsBelongingToDeletedGroup = await Team.query().where('groupId', group.id)
    
    assert.equal(teamsBelongingToDeletedGroup.length, 0)
    assert.exists(teamBelongingToControlGroup)

  })
  // .pin()

})
