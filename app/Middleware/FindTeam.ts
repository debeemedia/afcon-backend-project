import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'

export default class FindTeam {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const {response, params} = ctx
    const {id} = params
    if (!id) {
        return response.badRequest({message: 'Team Id not provided'})
    }

    let team: Team
    try {
      team = await Team.findOrFail(id)
      
    } catch (error) {
        return response.notFound({message: 'Unknown team was requested'})
    }

    ctx.requestedTeam = team

    await next()
  }
}
