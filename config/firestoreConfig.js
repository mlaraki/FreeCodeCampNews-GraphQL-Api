const config = require('./environment');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: config.DATABASE_URL
});

export const db = admin.firestore();