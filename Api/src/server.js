import express, { json } from 'express'
import cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import router from "./routes.js"

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(json())

app.get('/health', (req, res) => res.status(StatusCodes.OK).send("I'm ok!"))

app.use(router)

app.listen(port, () => console.log(`✅ Server running on port ${port}`))