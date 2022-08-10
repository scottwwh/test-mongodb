# MongoDB tests

## Background

Let's say that you inherit a live system whose database is running in MongoDB, and whose schemas grew to resemble a RDMS over time because that's an appropriate mental model for a complicated system with disparate data domains.

Let's also say that you suspect a large percentage of the system's performance issues are due to Mongo not being used to its fullest potential, but migrating everything to a new stack is infeasible for any number of reasons.

Where would you start?
1. **DONE** - Fake some data for various schemas which don't match the system itself, naturally, but are a basic relational model (i.e. breeders > cats < owners)
1. Quantify whether indexes make as big as difference as one would expect:
    1. **DONE** - When querying a single schema using customer-facing fields other than its primary key
    1. **DONE** - When joining multiple schemas to provide a denormalized view, because sometimes you wanna make life easy for front-end concerns
    1. **DONE** - Doing all of these things across identical databases, except that the second one has indexes
    1. Having a simple integration test to spit out comparative numbers
1. Log the frequency of various API requests that result in Mongo queries (approach here is important, because these are not real endpoints)
1. Figure out a way diagnose performance issues in the queries

## Development

Stack:
- Docker Compose
- Image
    - MongoDB (latest)
- Node v17.3 and NPM v8.3 (not yet Dockerized)
    - Dependencies
        - Koa
        - Mocha
        - Mongoose

To test:
```
# Load Mongo containers (see Gotchas)
docker-compose up mongo-a
docker-compose up mongo-b

# Node
cd ./web
npm i

# Seed Mongo databases (this is very slow, see Gotchas)
npm run db:init

# Compare results
cd ./src

# npm run test (NOT YET!!!)
node query
```

## Assumptions

- Indexes are probably really useful: https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/

## Gotchas

- **Testing indexes between cloned databases:** - Having two database in the same environment (i.e. instance) that are completely identical in all ways but name is not something that anyone would do in Production. But, we want _identical data whose only difference is whether some fields are indexed or not_ and I've tried two approaches:
    - **Cloned databases in one instance:** - Mongo seems to shares indexes across identically-named collections in different databases in the same instance, which leads to identical response times which change in sync as indexes are added. To work around this, our collections would need to be named slightly differently to avoid this (e.g. `db1:cat` and `db2:cat_indexed` ) and any code referring to collection names would be _just_ different enough to be annoying
    - **Use separate Docker containers for both databases** - The major downside to this approach (aside from memory) is that exporting/importing the database via shared mount is being slowed down by disk access - it's entirely possible that responses could be piped directly via Bash, but haven't looked yet
- **Cloning databases:** - Cloning a Mongo database is no longer possible via code, probably for good reasons, so we're going to accept that NPM can and will trigger `mongoexport|mongoimport` commands indirectly, across Docker containers, through a Bash script because it works for now
- **Mongo query results are temporarily cached** - Response times will get marginally faster over time, and then go back to defaults after you step away for a cup of coffee