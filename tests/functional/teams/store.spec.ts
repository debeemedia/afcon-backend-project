import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import {cuid} from '@ioc:Adonis/Core/Helpers'
import { string } from '@ioc:Adonis/Core/Helpers'
import Group from 'App/Models/Group'
import Team from 'App/Models/Team'
import { GroupFactory, TeamFactory } from 'Database/factories'



test.group('Teams store', (group) => {
  // Write your test here
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('create a team', async ({client, assert, route}) => {
    await Team.query().delete()
    await Group.query().delete()

    // const group = await Group.create({id: cuid(), name: 'Group A'})
    const group = await GroupFactory.create()
    // console.log(group.id);
    

    const payload = {
      country: 'Nigeria',
      nickname: 'Super Eagles',
      groupId: group.id
    }

    const response = await client.post(route('TeamsController.store'))
    .form(payload)
    const responseBody = response.body()

    // response.dumpBody()
    response.assertStatus(201)
    response.assertBodyContains(payload)

    const team = await Team.findOrFail(responseBody.id)
    assert.exists(team)
    assert.equal(team.id, responseBody.id)
  })
  // .pin()

  test('show that multiple teams belong to a group and are linked by foreign key', async ({client, assert, route}) => {
    await Team.query().delete()
    await Group.query().delete()

    const group = await Group.create({
      name: 'Group A'
    })

    await Team.create({
      country: 'Nigeria',
      nickname: 'Super Eagles',
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
    await Team.create({
      country: 'Ghana',
      nickname: 'Black Stars',
      groupId: controlGroup.id
    })

    const teamsBelongingToGroup = await Team.query().where('groupId', group.id)

    assert.equal(teamsBelongingToGroup.length, 2)
    assert.notEqual(teamsBelongingToGroup.length, 3)
  })
  // .pin()

  test('fail to create a team without required fields', async ({route, client, assert}) => {
    await Team.query().delete()

    const requiredFields = ['country', 'groupId']
    const payload = {}

    requiredFields.forEach(requiredField => {
      payload[requiredField] = ''
    })

    const response = await client.post(route('TeamsController.store'))
    .form(payload)

    // response.dumpBody()
    response.assertStatus(422)

    const errorMessages = requiredFields.map(requiredField => {
      return {
       
            rule: 'required',
            field: requiredField,
            message: `${requiredField.charAt(0).toUpperCase() + requiredField.slice(1)} is required`
      }
    })

    response.assertBodyContains({
      errors: errorMessages
    })
    
  })
  // .pin()
  test('fail to create a team with a country that already exists', async ({client, assert, route}) => {
    await Team.query().delete()

    const team = await TeamFactory.create()
    
    const payload = { country: team.country}

    const response = await client.post(route('TeamsController.store'))
    .form(payload)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'unique',
          field: 'country',
          message: 'Country is already in your teams'
        }
      ]
    
    })
  })
  // .pin()

  test('fail to create a team with the country character length greater than maxLength', async ({route, client, assert}) => {
    await Team.query().delete()
    const payload = {
      country: string.generateRandom(26),
      groupId: cuid()
    }
    // console.log(payload);
    
    
    
    const response = await client.post(route('TeamsController.store'))
    .form(payload)
    // console.log(response.response.text);

    // response.dumpBody()
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'maxLength',
          field: 'country',
          message: 'Country should be a maximum of 25 characters',
          args: {"maxLength": 25}
        }
      ]
    })
    
  })
  // .pin()

  test('fail to create a team with the nickname character length greater than maxLength', async ({route, client, assert}) => {
    await Team.query().delete()
    const payload = {
      country: string.generateRandom(25),
      nickname: string.generateRandom(31),
      groupId: cuid()
    }
    
    const response = await client.post(route('TeamsController.store'))
    .form(payload)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'maxLength',
          field: 'nickname',
          message: 'Nickname should be a maximum of 30 characters',
          args: {"maxLength": 30}
        }
      ]
    })
    
  })
  // .pin()

})
