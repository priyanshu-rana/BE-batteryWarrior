import vine from '@vinejs/vine'

export const UserValidator = vine.compile(
  vine.object({
    first_name: vine.string(),
    last_name: vine.string().optional(),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const result = await db.from('users').select('email').where('email', value).first()

        return result ? false : true
      }),
    password: vine.string(),
  })
)

export const LoginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)
