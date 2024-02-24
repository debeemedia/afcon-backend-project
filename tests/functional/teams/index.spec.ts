import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Team from 'App/Models/Team'
import { TeamFactory } from 'Database/factories'

test.group('Teams index', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  
  test('fetch paginated list of teams', async ({client, assert, route}) => {

    await Team.query().delete()

    const total = 24
    const page = 1
    const perPage = 6

    await TeamFactory.createMany(total)

    const response = await client.get('/teams').qs({
      page,
      perPage
    })
    const responseBody = response.body()

    // response.dumpBody()
    // console.log(response.response.text);
    
    response.assertStatus(200)
    assert.property(responseBody.data, 'data')
    assert.isArray(responseBody.data.data)
    assert.equal(responseBody.data.data.length, perPage)
    assert.equal(responseBody.data.meta.current_page, page)
    assert.equal(responseBody.data.meta.per_page, perPage)
    assert.equal(responseBody.data.meta.total, total)

  })
  .pin()
})
