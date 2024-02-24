import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Group from 'App/Models/Group'
import Team from 'App/Models/Team'
import { TeamFactory } from 'Database/factories'

test.group('Teams show', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('fetch a team', async ({client, assert, route}) => {
    await Team.query().delete()

    const team = await TeamFactory.create()

    const response = await client.get(route('TeamsController.show', {id: team.id}))
    const responseBody = response.body()

    // response.dumpBody()

    response.assertStatus(200)
    response.assertBodyContains(
      {
        data: {
          id: team.id,
          country: team.country
        }
      }
    )

    const fetchedTeam = await Team.findOrFail(team.id)
    assert.equal(responseBody.data.id, fetchedTeam.id)
    assert.equal(responseBody.data.country, fetchedTeam.country)
  })
  // .pin()

  test('fetch a team, along with details of the group it belongs to', async ({client, assert, route}) => {
    await Team.query().delete()
    await Group.query().delete()

    const group = await Group.create({
      name: 'Group A'
    })

    const team = await Team.create({
      country: 'Nigeria',
      nickname: 'Super Eagles',
      groupId: group.id
    })

    const response = await client.get(route('TeamsController.show', {id: team.id}))
    const responseBody = response.body()

    // response.dumpBody()

    response.assertStatus(200)
    response.assertBodyContains(
      {
        data: {
          id: team.id,
          country: team.country,
          nickname: team.nickname,
          groupId: group.id,
          group: {
            id: group.id,
            name: group.name
          }
        }
      }
    )
    
    const fetchedGroup = await Group.findOrFail(group.id)
    assert.equal(responseBody.data.group.id, fetchedGroup.id)
  })
  // .pin()
})
