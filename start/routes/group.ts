import Route from '@ioc:Adonis/Core/Route'

Route.resource('groups', 'GroupsController').apiOnly().middleware({
    show: ['findGroup'],
    update: ['findGroup'],
    destroy: ['findGroup']
})