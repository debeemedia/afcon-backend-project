import Group from "App/Models/Group";

declare module '@ioc:Adonis/Core/HttpContext' {
    interface HttpContextContract {
        requestedGroup?: Group
    }
}