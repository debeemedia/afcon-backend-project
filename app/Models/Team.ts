import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import {cuid} from '@ioc:Adonis/Core/Helpers'


export default class Team extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public country: string

  @column()
  public nickname: string

  @column.dateTime({ serializeAs: 'createdAt', autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ serializeAs: 'updatedAt', autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static generateUUID (team: Team): void {
    team.id = cuid()
  }
  
}
