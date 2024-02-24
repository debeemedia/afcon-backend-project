import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Group from 'App/Models/Group'
import Team from 'App/Models/Team'
import TeamValidator from 'App/Validators/TeamValidator'

export default class TeamsController {

    public async index ({request, response}: HttpContextContract) {
        const {page, perPage} = request.qs()
        const teams = await Team.query().preload('group', (query) => query.select('name')).select(['id', 'country', 'nickname', 'groupId']).paginate(page, perPage)
        return response.ok({data: teams})
    }

    public async store ({request, response}: HttpContextContract) {
        const payload = await request.validate(TeamValidator)
        
        let group = await Group.findOrFail(payload.groupId)
        const team = await Team.create(payload)
        await group.related('teams').save(team)

        return response.created(team)
    }

    public async show ({request, response, requestedTeam}: HttpContextContract) {
        await requestedTeam?.load('group', (query) => query.select('name'))
        return response.ok({data: requestedTeam})
    }

    public async update ({request, response, requestedTeam}: HttpContextContract) {
        const payload = await request.validate(TeamValidator)

        // assign the team to another group if groupId changes
        if ('groupId' in payload && payload.groupId !== requestedTeam?.groupId) {
            const group = await Group.findOrFail(payload.groupId)
            if (group) {
                requestedTeam!.groupId = payload.groupId
                await group.related('teams').save(requestedTeam!)
            } else {
                return response.badRequest({message: 'Invalid group Id provided'})
            }
        }

        requestedTeam?.merge(payload)
        await requestedTeam?.save()

        await requestedTeam?.load('group', (query) => query.select('name'))
        return response.ok({message: 'Team was edited', data: requestedTeam})
    }

    public async destroy ({request, response, requestedTeam}: HttpContextContract) {
        await requestedTeam?.delete()
        return response.ok({message: 'Team was deleted', data: requestedTeam?.id})
    }



}
