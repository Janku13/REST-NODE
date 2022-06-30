import mongoose from 'mongoose'
import config from 'config'
import logger from './logger'

async function connect() {
  const dbUri = config.get<string>("dbUri")
  try {
    await mongoose.connect(dbUri)
     logger.info("mongoose db connected ");
  } catch (error) {
     logger.error(error)
      process.exit(1);
  }

}

export default connect