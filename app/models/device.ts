import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Device extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare model: string

  @column()
  declare type: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'users_devices',
    pivotColumns: ['last_logged_in', 'is_primary', 'meta_data'],
  })
  public users!: ManyToMany<typeof User>
}
