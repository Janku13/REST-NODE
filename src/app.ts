import express from 'express'
import config from 'config'
import connect from './utils/connect.ts'
import logger from './utils/logger.ts'
import routes from './routes.ts'

const port = config.get<number>('port')
const app = express()


app.listen(port, async () => {
  logger.info(`App is on port ${port}`);
  await connect()
  routes(app)
})