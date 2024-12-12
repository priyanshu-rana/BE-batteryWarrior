import Device from '#models/device'
import { DeviceValidator } from '#validators/device'
import { HttpContext } from '@adonisjs/core/http'

export default class DeviceController {
  async registerDevice({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.use('web').authenticate()
      const payload = await request.validateUsing(DeviceValidator)
      const device = await Device.create(payload)

      // Accociate the device to the user
      await user.related('devices').attach({
        [device.id]: {
          last_logged_in: new Date(),
          is_primary: false,
          meta_data: {},
        },
      })

      response.ok({
        message: 'Device created and associated with the user',
        device: {
          device,
        },
      })
    } catch (error) {
      return response.unprocessableEntity({
        errors: error.messages || error.message,
      })
    }
  }
}
