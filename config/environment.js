require('dotenv').config()

module.exports = {
	PORT: process.env.PORT,
	REDIS_PORT: process.env.REDIS_PORT,
	REDIS_HOST: process.env.REDIS_HOST,
	TEST_URL: process.env.TEST_URL,
	DATABASE_URL: process.env.DATABASE_URL,
	DATABASE_COLLECTION: process.env.DATABASE_COLLECTION
}