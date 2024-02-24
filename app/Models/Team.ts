import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, beforeCreate, beforeSave, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import {cuid} from '@ioc:Adonis/Core/Helpers'
import Group from 'App/Models/Group'


export default class Team extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public country: string

  @column()
  public nickname: string

  @column({serializeAs: 'groupId'})
  public groupId: string

  @belongsTo(() => Group)
  public group: BelongsTo<typeof Group>

  @column.dateTime({ serializeAs: 'createdAt', autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ serializeAs: 'updatedAt', autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static generateUUID (team: Team): void {
    team.id = cuid()
  }
  
}
