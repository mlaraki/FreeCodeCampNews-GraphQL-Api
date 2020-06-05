![Continuous Integration](https://github.com/mlaraki/FreeCodeCampNews-GraphQL-Api/workflows/Continuous%20Integration/badge.svg)

## FreeCodeCamp news graphql api :

Playground : http://ec2-34-239-254-11.compute-1.amazonaws.com:9000/graphql

### Description

- Articles from FreeCodeCampNews are scrapped every 6 hours and added to a db hosted on firestore.
- It's a free and open API hosted on a EC2 AWS server. 

### API

- Fastify
- GraphQL
- Apollo-Server
- Redis-Cache

### Unit tests

- Mocha
- Chai
- Supertest

### Continuous Integration

  - Github Action

```
name: Continuous Integration

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Redis setup
      uses: shogo82148/actions-setup-redis@v1
      with:
        redis-version: '6.x'
    - name: Use Node.js 12.x
      uses: actions/setup-node@v1
      with:
        node-version: '12.x'
    - name: Redis ping check
      run: redis-cli ping
    - name: Decrypt service account
      run: sh ./.github/workflows/decrypt_serviceAccount.sh
      env:
        DECRYPT_KEY: ${{ secrets.DECRYPT_KEY }}
    - run: npm install
    - run: npm run ci
      env:
        PORT: 9000
        REDIS_PORT: 6379
        REDIS_HOST: "0.0.0.0"
        TEST_URL: "0.0.0.0:9000/graphql"
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
        DATABASE_COLLECTION: ${{ secrets.DATABASE_COLLECTION }}
```
