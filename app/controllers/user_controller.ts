import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { LoginValidator, UserValidator } from '#validators/user'
import hash from '@adonisjs/core/services/hash'

export default class UserController {
  async registerUser({ request, response, auth }: HttpContext) {
    try {
      // Validate or validation
      const payload = await request.validateUsing(UserValidator)
      // User Creation
      const user = await User.create(payload)

      await auth.use('web').login(user)

      const isLoggedIn = await auth.use('web').check()
      console.log('Is user logged in:', isLoggedIn)

      response.ok({
        message: 'User created',
        fullName: `${user.first_name} ${user.last_name ? user.last_name : ''}`,
        email: user.email,
        isLoggedIn: isLoggedIn,
      })
    } catch (error) {
      return response.unprocessableEntity({
        errors: error.messages || error.message,
      })
    }
  }

  async login({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(LoginValidator)
      // const user = await User.query().where('email', payload.email).first()
      // if (!user) response.badRequest({ message: 'Invalid credentials' })
      // const verifyPassword = await User.verifyCredentials(user!.email, payload.password)
      // console.log('verifyPassword', verifyPassword)

      const user = await User.findByOrFail('email', payload.email)
      const isValidPassword = await hash.verify(user.password, payload.password)
      console.log('isValidPassword', isValidPassword)
      if (!isValidPassword) {
        throw new Error('Invalid credentials')
      }
      await auth.use('web').login(user!)
      const isLoggedIn = await auth.use('web').check()

      return response.ok({
        message: 'Login successful',
        isLoggedIn,
      })
    } catch (error) {
      const isValidationError = error.messages !== undefined

      return response.status(isValidationError ? 422 : 500).json({
        message: isValidationError ? 'Validation error' : 'Internal server error',
        errors: error.messages ?? error.message,
      })
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    const isLoggedIn = await auth.use('web').check()
    return response.ok({ message: 'Logged out successfully', isLoggedIn })
  }

  async checkLoginStatus({ response, auth }: HttpContext) {
    const isLoggedIn = await auth.use('web').check()
    return response.ok({ isLoggedIn })
  }

  async profile({ auth, response }: HttpContext) {
    try {
      const user = await auth.use('web').authenticate()
      return response.ok(user)
    } catch {
      return response.unauthorized({ message: 'Not logged in' })
    }
  }
}
