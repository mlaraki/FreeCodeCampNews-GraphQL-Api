const config = require('../config/environment');
const expect = require('chai').expect();
const should = require('chai').should();
const request = require('supertest')(config.TEST_URL);

describe('GraphQL News API', () => {
	it('articlesCount : Returns articles count = articlesGetAll.length', (done) => {
        request.post('/')
        .send({ query: '{articlesCount,articlesGetAll{uid}}'})
        .expect(200)
        .end((err,res) => {
			if (err) return done(err);
			let { articlesCount, articlesGetAll } = res.body.data;
			articlesCount.should.equal(articlesGetAll.length);
            done();
        })
	}),
	it('articlesByTag : Returns articles with tag = "javascript"', (done) => {
        request.post('/')
        .send({ query: '{articlesByTag(tag:"javascript"){tag}}'})
        .expect(200)
        .end((err,res) => {
			if (err) return done(err);
			let { articlesByTag } = res.body.data;
			articlesByTag.forEach(article => {
				article.tag.should.equal("javascript");
			})
            done();
        })
	}),
	it('articlesByDate : Returns articles with timestampStart <= created_at < timestampEnd', (done) => {
        request.post('/')
        .send({ query: '{articlesByDate(timestampStart:1590036483656, timestampEnd:1590933172483){created_at}}'})
        .expect(200)
        .end((err,res) => {
			if (err) return done(err);
			let { articlesByDate } = res.body.data;
			articlesByDate.forEach(article => {
				let timestamp = +article.created_at;
				timestamp.should.be.above(1590036483655);
				timestamp.should.be.below(1590933172483);
			})
            done();
        })
	}),
	it('articlesGetAll : Returns all articles with all fields present', (done) => {
        request.post('/')
        .send({ query: '{articlesGetAll{created_at,uid,image,link,title,tag}}'})
        .expect(200)
        .end((err,res) => {
			if (err) return done(err);
			let { articlesGetAll } = res.body.data;
			articlesGetAll.forEach(article => {
				article.should.include.all.keys('created_at','uid','image','link','title','tag');
			})
            done();
        })
	}),
	it('articlesBatch : Returns a batch of size (size) from (startFrom) in desc order', (done) => {
        request.post('/')
        .send({ query: '{articlesBatch(startFrom:59, size: 18){uid}}'})
        .expect(200)
        .end((err,res) => {
			if (err) return done(err);
			let { articlesBatch } = res.body.data;
			articlesBatch[0].uid.should.equal(59);
			articlesBatch[articlesBatch.length - 1].uid.should.equal(42);
			articlesBatch.length.should.equal(18);
            done();
        })
	}),
	it('articlesBatch : if startFrom = 0 should return an empty array', (done) => {
        request.post('/')
        .send({ query: '{articlesBatch(startFrom:0, size: 2){uid}}'})
        .expect(200)
        .end((err,res) => {
			if (err) return done(err);
			let { articlesBatch } = res.body.data;
			articlesBatch.should.be.empty;
            done();
        })
	}),
	it('articlesBatch : if size > startFrom should return startFrom articles', (done) => {
        request.post('/')
        .send({ query: '{articlesBatch(startFrom:3, size: 42){uid}}'})
        .expect(200)
        .end((err,res) => {
			if (err) return done(err);
			let { articlesBatch } = res.body.data;
			articlesBatch.length.should.equal(3);
            done();
        })
    }),
    it('articlesByUid : Returns article with uid = 42', (done) => {
        request.post('/')
        .send({ query: '{articlesByUid(uid:42){uid,created_at,image,link,tag,title}}'})
        .expect(200)
        .end((err,res) => {
			if (err) return done(err);
			let { articlesByUid } = res.body.data;

			articlesByUid.should.have.property('uid')
			articlesByUid.uid.should.equal(42)

			articlesByUid.should.have.property('created_at')
			articlesByUid.created_at.should.equal("1590933178367")
			
			articlesByUid.should.have.property('image')
			articlesByUid.image.should.equal("https://images.unsplash.com/photo-1590506027233-b9838b10f01a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ")

			articlesByUid.should.have.property('link')
			articlesByUid.link.should.equal("https://www.freecodecamp.org/news/creating-your-very-own-chip-8-emulator/")

			articlesByUid.should.have.property('tag')
			articlesByUid.tag.should.equal("javascript")
			
			articlesByUid.should.have.property('title')
			articlesByUid.title.should.equal("How to Create Your Very Own Chip-8 Emulator")

            done();
        })
	})
});