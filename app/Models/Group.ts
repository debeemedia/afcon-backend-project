import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import {cuid} from '@ioc:Adonis/Core/Helpers'


export default class Group extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

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

  @beforeSave()
  public static transformName (group: Group): void {
    group.name = group.name.toUpperCase()
    group.name = group.name.replace(/[-_]/g, ' ')
  }
  
}
