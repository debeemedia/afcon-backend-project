import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Group from 'App/Models/Group'

export default class FindGroup {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const {response, params} = ctx
    const {id} = params
    if (!id) {
        return response.badRequest({message: 'Group Id not provided'})
    }
    
    // const group: Group = await Group.findOrFail(id)
    // if (!group) {
    //     return response.notFound({message: 'Unknown group was requested'})
    // }

    let group: Group
    try {
      group = await Group.findOrFail(id)
      
    } catch (error) {
        return response.notFound({message: 'Unknown group was requested'})
    }

    ctx.requestedGroup = group

    await next()
  }
}
