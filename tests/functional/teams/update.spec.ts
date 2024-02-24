import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Group from 'App/Models/Group'
import Team from 'App/Models/Team'
import { GroupFactory, TeamFactory } from 'Database/factories'

test.group('Teams update', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('update a team', async ({client, assert, route}) => {
    await Team.query().delete()
    await Group.query().delete()

    const group = await GroupFactory.create()

    const team = await Team.create({
      country: 'Nigeria',
      groupId: group.id
    })
    
    const newCountry = 'Equatorial Guinea'

    const response = await client.put(route('TeamsController.update', {id: team.id}))
    .form({
      ...team,
      country: newCountry
    })
    const responseBody = response.body()

    // response.dumpBody()

    response.assertStatus(200)
    response.assertBodyContains(
      {
        message: 'Team was edited',
        data: {
          id: team.id,
          country: newCountry
        }
      }
    )

    const updatedTeam = await Team.findOrFail(team.id)
    assert.equal(updatedTeam.country, responseBody.data.country)
  })
  // .pin()

  test(`show that when a team's groupId is updated, the relationship between the team and the group changes to the new group`, async ({client, assert, route}) => {
    await Team.query().delete()
    await Group.query().delete()

    const group1 = await GroupFactory.create()
    const group2 = await GroupFactory.create()

    const team = await Team.create({
      country: 'Nigeria',
      groupId: group1.id
    })

    await client.put(route('TeamsController.update', {id: team.id}))
    .form({
      ...team,
      groupId: group2.id
    })

    // console.log(group1.id);
    // console.log(group2.id);
    // response.dumpBody()

    const fetchedTeam = await Team.findByOrFail('groupId', group2.id)
    assert.exists(fetchedTeam)

  })
  // .pin()

})
