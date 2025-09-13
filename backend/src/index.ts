import 'dotenv/config'
import { app } from "./app";
import './jobs/workers/email-worker'
import './jobs/workers/otp-worker'

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Server ready at: http://localhost:${PORT}`))