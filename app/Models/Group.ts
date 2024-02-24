import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeCreate, beforeSave, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import {cuid} from '@ioc:Adonis/Core/Helpers'
import Team from 'App/Models/Team'
import {string} from '@ioc:Adonis/Core/Helpers'


export default class Group extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @hasMany(() => Team)
  public teams: HasMany<typeof Team>

  @column()
  public name: string

  @column.dateTime({ serializeAs: 'createdAt', autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ serializeAs: 'updatedAt', autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static generateUUID (group: Group): void {
    group.id = cuid()
  }

  // @beforeSave()
  // public static transformName (group: Group): void {
  //   // group.name = group.name.toUpperCase()
  //   // group.name = group.name.replace(/[-_]/g, ' ')
  //   group.name = string.capitalCase(group.name)
  // }
  
}
