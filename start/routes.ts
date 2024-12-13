/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const UserController = () => import('#controllers/user_controller')
const DeviceController = () => import('#controllers/device_controller')
import router from '@adonisjs/core/services/router'

// router.on('/').render('pages/home')

router.post('/register-user', [UserController, 'registerUser'])
router.post('/login', [UserController, 'login'])
router.post('/logout', [UserController, 'logout'])
router.get('/profile', [UserController, 'profile'])
router.get('/check-login', [UserController, 'checkLoginStatus'])
router.post('/register-device', [DeviceController, 'registerDevice'])
router.post('/create-user-device-record', [DeviceController, 'createUserDeviceRecord'])
