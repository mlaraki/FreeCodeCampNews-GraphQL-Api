const config = require('./config/environment');
const { ApolloServer } = require('apollo-server-fastify');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./schemas/resolvers');
import { makeExecutableSchema } from '@graphql-tools/schema';
import { LongResolver } from 'graphql-scalars';

const PORT = config.PORT || 9000;

const server = new ApolloServer({
	schema: makeExecutableSchema({
		typeDefs: [
			typeDefs
		],
		resolvers: {
			Long: LongResolver,
			...resolvers
		},
	}),
});

const app = require('fastify')();

app.register(server.createHandler());

app.get('/', function (request, reply) {
	reply.status(200).send('Go to /graphql to use the playground')
})

app.listen(PORT, '0.0.0.0', function (err, address) {
	if (err) {
	  app.log.error(err)
	  process.exit(1)
	}
	console.log(`server listening on ${address}`)
  })