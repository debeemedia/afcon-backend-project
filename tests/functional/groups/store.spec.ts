import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Group from 'App/Models/Group'
import { GroupFactory } from 'Database/factories'

test.group('Groups store', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('create a new group', async ({client, assert, route}) => {
    await Group.query().delete()
    
    const payload = {
      name: 'Group A'
    }
    const response = await client.post(route('GroupsController.store'))
    .form(payload)
    // response.dumpBody()
    const responseBody = response.body()

    response.assertStatus(201)
    response.assertBodyContains(payload)

    const contact = await Group.query().where('name', payload.name).firstOrFail()
    assert.exists(contact)
    assert.equal(responseBody.id, contact.id)
    
  })
  // .pin()

  test('fail to create a group with a name that already exists', async ({client, assert, route}) => {
    await Group.query().delete()

    const group = await GroupFactory.create()
    
    const payload = { name: group.name}

    const response = await client.post(route('GroupsController.store'))
    .form(payload)

    // response.dumpBody()

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'unique',
          field: 'name',
          message: 'Name is already in your groups'
        }
      ]
    
    })
  })
  // .pin()

  test('fail to create a group with a name that is not one of: Group A, Group B, Group C, Group D, Group E, Group F', async ({client, assert, route}) => {

    await Group.query().delete()

    const invalidNames = ['Group a', 'group B', 'GROUP C', 'group d', 'Group G']
    const payload = {name: ''}

    for (const invalidName of invalidNames) {
      payload.name = invalidName
      const response = await client.post(route('GroupsController.store'))
      .form(payload)

      response.assertStatus(422)
      response.assertBodyContains({
        errors: [
          {
            rule: 'enum',
            field: 'name',
            message: 'Name can only be one of Group A,Group B,Group C,Group D,Group E,Group F',
            args: {
              "choices": ["Group A", "Group B", "Group C", "Group D", "Group E", "Group F"]
            }
          }
        ]
      })
    }

  })
  // .pin()

  test('fail to create a group without a name', async ({client, assert, route}) => {
    await Group.query().delete()

    const payload = {}
    const response = await client.post(route('GroupsController.store'))
    .form(payload)

    response.assertStatus(422)
    // response.dumpBody()
    response.assertBodyContains({
      errors: [ { rule: 'required', field: 'name', message: 'Name is required' } ]
    })
  })
  // .pin()

})
