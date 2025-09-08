import express from "express"
import { register, verifyOtp, confirmPassword, login, logout, forgetPassword, verifyOtpForPassword, resetPassword, authCheck } from "../../../controllers/auth/auth-controller"
// import { auth } from "../../../middlewares/auth-middleware"

const router = express.Router()

//* Register process
router.post('/register', register)
router.post('/verify-otp', verifyOtp)
router.post('/confirm-password', confirmPassword)

//* Login & Logout
router.post('/login', login)
router.post('/logout', logout)

//* Forgot Process
router.post('/forgot-password', forgetPassword)
router.post('/verify-forgot-otp', verifyOtpForPassword)
router.post('/reset-password', resetPassword)

export default router