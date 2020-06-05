const config = require('../config/environment');
const {redis_getArticles, redis_setArticles} = require("../redis_cache/handlers");
const { db } = require("../config/firestoreConfig");

export const resolvers = {
	Query: {
		articlesCount: async () => {
			try {
				let cache = await redis_getArticles();
				if (cache) return cache.length;
				else {
					let doc = await db.collection(config.DATABASE_COLLECTION).doc("cursor").get();
					let { cursor } = doc.data();
					redis_setArticles();
					return cursor;
				}
			} catch (error) {
				throw error;
			}
		},
		articlesGetAll: async () => {
			try {
				let articles;
				let cache = await redis_getArticles();
				if (cache) articles = cache;
				else {
					let snap = await db.collection(config.DATABASE_COLLECTION).where("uid", ">", 0).get();
					articles = snap.docs.map(doc => doc.data());
					redis_setArticles(articles);
				}
				return articles;
			} catch (error) {
				throw error;
			}
		},
		articlesByUid: async (_, { uid }) => {
			try {
				let cache = await redis_getArticles();
				if (cache) {
					let article = cache.find(art => art.uid == uid);
					return article;
				} else {
					let snap = await db.collection(config.DATABASE_COLLECTION).where("uid", "==", uid).get();
					let doc = snap.docs.map(doc => doc.data());
					redis_setArticles();
					return doc[0] || null;
				}
			} catch (error) {
				throw error;
			}
		},
		articlesByTag: async (_, { tag }) => {
			try {
				let articles;
				let cache = await redis_getArticles();
				if (cache) articles = cache.filter(art => art.tag == tag);
				else {
					let snap = await db.collection(config.DATABASE_COLLECTION).where("tag", "==", tag).get();
					articles = snap.docs.map(doc => doc.data());
					redis_setArticles();
				}
				return articles;
			} catch (error) {
				throw error;
			}
		},
		articlesBatch: async (_, {startFrom, size }) => {
			try {
				if(startFrom == 0) return [];
				let maxSize = await resolvers.Query.articlesCount();
				let cursor = startFrom > maxSize ? maxSize : startFrom;
				let batchSize = size > maxSize ? maxSize : size;
				let cache = await redis_getArticles();
				let articles;
				if(cache){
					let sorted = cache.sort((a,b) => b.uid - a.uid);
					let index = sorted.length - cursor
					articles = sorted.slice(index, index+batchSize)
				}else {
					let snap = await db.collection(config.DATABASE_COLLECTION).orderBy("uid", "desc").startAt(cursor).limit(batchSize).get()
					articles = snap.docs.map(doc => doc.data());
				}
				return articles
			} catch (error) {
				throw error;
			}
		},
		articlesByDate: async (_, { timestampStart, timestampEnd = null }) => {
			try {
				let articles;
				let cache = await redis_getArticles();
				if (cache) {
					if(timestampStart && timestampEnd) articles = cache.filter(art => art.created_at >= timestampStart && art.created_at < timestampEnd)
					else articles = cache.filter(art => art.created_at >= timestampStart)
				} else {
					let snap;
					if (timestampStart && timestampEnd) 
						snap = await db.collection(config.DATABASE_COLLECTION).where("created_at", ">=", +timestampStart.toString()).where("created_at", "<=", +timestampEnd.toString()).get();
					else
						snap = await db.collection(config.DATABASE_COLLECTION).where("created_at", ">=", +timestampStart.toString()).get();
					articles = snap.docs.map(doc => doc.data());
					redis_setArticles();
				}
				return articles;
			} catch (error) {
				throw error;
			}
		},
	},
};