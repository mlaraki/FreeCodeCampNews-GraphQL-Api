import redis from "../config/redisConfig"
import { db } from "../config/firestoreConfig";

async function redis_getArticles() {
	try {
		let articles = await redis.get("articles");
		return JSON.parse(articles);
	} catch (error) {
		throw error;
	}
}

async function redis_setArticles(json) {
	try {
		let articles;
		if(json) articles = JSON.stringify(json);
		else {
			let snap = await db.collection("chromeExtension-articles").where("uid", ">", 0).get();
			let docs = snap.docs.map(doc => doc.data());
			articles = JSON.stringify(docs);
		}
		await redis.setex("articles", 60 * 60 * 3, articles);
	} catch (error) {
		throw error;
	}
}

module.exports = {
	redis_getArticles,
	redis_setArticles
}
