import Route from '@ioc:Adonis/Core/Route'

Route.resource('teams', 'TeamsController').apiOnly().middleware({
    show: ['findTeam'],
    update: ['findTeam'],
    destroy: ['findTeam']
})