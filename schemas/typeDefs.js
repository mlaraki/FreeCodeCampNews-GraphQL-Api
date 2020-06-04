const { gql } = require("apollo-server-fastify");

export const typeDefs = gql`
  scalar Long
  type Article {
    created_at: Long
    uid: Int
    image: String
    link: String
    tag: String
    title: String
  }
  type Query {
    articlesCount: Int
    articlesGetAll: [Article]
    articlesByUid(uid: Int!): Article
    articlesByTag(tag: String!): [Article]
    articlesBatch(startFrom: Int!, size: Int!): [Article]
    articlesByDate(timestampStart: Long!, timestampEnd: Long): [Article]
  }
`;
