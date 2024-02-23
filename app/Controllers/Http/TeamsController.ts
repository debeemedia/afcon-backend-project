import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'
import TeamValidator from 'App/Validators/TeamValidator'

export default class TeamsController {

    public async index ({request, response}: HttpContextContract) {
        const {page, perPage} = request.qs()
        const teams = await Team.query().select(['id', 'name']).paginate(page, perPage)
        // const teams = await Team.query().select(['id', 'name'])
        return response.ok({data: teams})
    }

    public async store ({request, response}: HttpContextContract) {
        const payload = await request.validate(TeamValidator)
        const team = await Team.create(payload)

        // await team.refresh()
        return response.created(team)
    }

    public async show ({request, response, requestedTeam}: HttpContextContract) {
        return response.ok({data: requestedTeam})
    }

    public async update ({request, response, requestedTeam}: HttpContextContract) {
        const payload = await request.validate(TeamValidator)
        requestedTeam?.merge(payload)
        await requestedTeam?.save()
        return response.ok({message: 'Team was edited', data: requestedTeam})
    }

    public async destroy ({request, response, requestedTeam}: HttpContextContract) {
        await requestedTeam?.delete()
        return response.ok({message: 'Team was deleted', data: requestedTeam?.id})
    }



}
