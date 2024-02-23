import Group from "App/Models/Group";
import Team from "App/Models/Team";

declare module '@ioc:Adonis/Core/HttpContext' {
    interface HttpContextContract {
        requestedGroup?: Group
        requestedTeam?: Team
    }
}