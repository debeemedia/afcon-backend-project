import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Team from 'App/Models/Team'
import { TeamFactory } from 'Database/factories'

test.group('Teams destroy', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('delete a team', async ({client, assert, route}) => {
    await Team.query().delete()

    const team = await TeamFactory.create()

    const response = await client.delete(route('TeamsController.destroy', {id: team.id}))

    // response.dumpBody()
    response.assertStatus(200)
    response.assertBodyContains(
      { message: 'Team was deleted', data: team.id }
    )

    const deletedTeam = await Team.find(team.id)
    assert.notExists(deletedTeam)
  })
  // .pin()
})
