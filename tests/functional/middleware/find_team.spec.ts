import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import {cuid} from '@ioc:Adonis/Core/Helpers'
import Team from 'App/Models/Team'

test.group('Middleware find team', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('fail to find a team that does not exist', async ({client, assert}) => {
    await Team.query().delete()

    const id = cuid()

    const response = await client.get(`/teams/${id}`)

    // response.dumpBody()

    response.assertStatus(404)
    response.assertBodyContains(
      { message: 'Unknown team was requested' }
    )
  })
  // .pin()
})
