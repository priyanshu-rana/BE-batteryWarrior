import Device from '#models/device'
import { DeviceValidator } from '#validators/device'
import { HttpContext } from '@adonisjs/core/http'

export default class DeviceController {
  async registerDevice({ request, response, auth }: HttpContext) {
    try {
      // TODO: Only admin user can create devices seperately
      const user = await auth.use('web').authenticate() // For Authetication
      const payload = await request.validateUsing(DeviceValidator)
      const device = await Device.create(payload)

      response.ok({
        message: 'Device created',
        device: {
          device,
        },
      })

      //   // Accociate the device to the user
      //   await user.related('devices').attach({
      //     [device.id]: {
      //       last_logged_in: new Date(),
      //       is_primary: false,
      //       meta_data: {},
      //     },
      //   })

      //   response.ok({
      //     message: 'Device created and associated with the user',
      //     device: {
      //       device,
      //     },
      //   })
    } catch (error) {
      return response.unprocessableEntity({
        errors: error.messages || error.message,
      })
    }
  }

  async createUserDeviceRecord({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.use('web').authenticate()
      const payload = await request.validateUsing(DeviceValidator)

      let device = await Device.query()
        .where('name', payload.name)
        .andWhere('model', payload.model)
        .first()
      let responseMessage = ''

      if (device) {
        const userDeviceRecord = await user
          .related('devices')
          .query()
          .where('user_id', user.id)
          .andWhere('device_id', device.id)
          .first()

        if (userDeviceRecord)
          return response.conflict({ message: 'Device is already registerd for the user' })
        responseMessage = 'Device already exists and assigned to the user'
      } else {
        device = await Device.create(payload)
        console.log('creting new device')
        responseMessage = 'New device created and assigned to the user'
      }

      await user.related('devices').attach({
        [device.id]: {
          last_logged_in: new Date(),
          is_primary: false,
          meta_data: {},
          created_at: new Date(),
          updated_at: new Date(),
        },
      })

      response.ok({
        status: 'success',
        message: responseMessage,
        data: { device },
      })
    } catch (error) {
      return response.unprocessableEntity({
        errors: error.messages || error.message,
      })
    }
  }
}
