import vine from '@vinejs/vine'

export const DeviceValidator = vine.compile(
  vine.object({
    name: vine.string(),
    model: vine
      .string()
      .unique(async (db, value) =>
        (await db.from('devices').select('model').where('model', value).first()) ? false : true
      ),
    type: vine.string(),
  })
)
