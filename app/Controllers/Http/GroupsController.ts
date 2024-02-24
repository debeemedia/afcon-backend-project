import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Group from 'App/Models/Group'
import GroupValidator from 'App/Validators/GroupValidator'

export default class GroupsController {

    public async index ({request, response}: HttpContextContract) {
        // const {page, perPage} = request.qs()
        // const groups = await Group.query().select(['id', 'name']).paginate(page, perPage)
        const groups = await Group.query().select(['id', 'name'])
        return response.ok({data: groups})
    }

    public async store ({request, response}: HttpContextContract) {
        const payload = await request.validate(GroupValidator)
        const group = await Group.create(payload)

        // await group.refresh()
        return response.created(group)
    }

    public async show ({request, response, requestedGroup}: HttpContextContract) {
        // await requestedGroup?.load('teams', (query) => query.select('country', 'nickname'))
        return response.ok({data: requestedGroup})
    }

    public async update ({request, response, requestedGroup}: HttpContextContract) {
        const payload = await request.validate(GroupValidator)
        requestedGroup?.merge(payload)
        await requestedGroup?.save()
        return response.ok({message: 'Group was edited', data: requestedGroup})
    }

    public async destroy ({request, response, requestedGroup}: HttpContextContract) {
        await requestedGroup?.delete()
        return response.ok({message: 'Group was deleted', data: requestedGroup?.id})
    }



}
