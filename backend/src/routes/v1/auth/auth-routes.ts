import express from "express"
import { register, verifyOtp, confirmPassword, login, logout, forgotPassword, resetPassword, verifyForgotOTP } from "../../../controllers/auth/auth-controller"

const router = express.Router()

//* Register process
router.post('/register', register)
router.post('/verify-otp', verifyOtp)
router.post('/confirm-password', confirmPassword)

//* Login & Logout
router.post('/login', login)
router.post('/logout', logout)

//* Forgot Process
router.post('/forgot-password', forgotPassword)
router.post('/verify-forgot-otp', verifyForgotOTP)
router.post('/reset-password', resetPassword)

export default router