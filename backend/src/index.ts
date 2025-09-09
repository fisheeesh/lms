import 'dotenv/config'
import { app } from "./app";
import "./syslog-listener"

const PORT = process.env.PORT || 4000

//* everything is middleware in express
app.listen(PORT, () => console.log(`Server ready at: http://localhost:${PORT}`))