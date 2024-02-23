import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import {cuid} from '@ioc:Adonis/Core/Helpers'
import Group from 'App/Models/Group'


test.group('Middleware find group', (group) => {
  // Write your test here

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('fail to find a group that does not exist', async ({client, assert}) => {
    await Group.query().delete()

    const id = cuid()

    const response = await client.get(`/groups/${id}`)

    // response.dumpBody()

    response.assertStatus(404)
    response.assertBodyContains(
      { message: 'Unknown group was requested' }
    )
  })
  // .pin()
})
