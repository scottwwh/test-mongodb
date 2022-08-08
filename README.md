# MongoDB tests

## Introduction

Let's say that you inherit a live system whose database is running in MongoDB, and whose schemas grew to resemble a RDMS over time because that is typically the appropriate mental model for a complicated system with disparate data domains.

Let's also say that you suspect a large percentage of the system's performance issues are due to Mongo not being used to its fullest potential, but migrating everything to a new stack is infeasible for any number of reasons.

Where would you start?
1. Simulate some data into various schemas which don't match the system itself, naturally, but do resemble a basic relational model
1. Quantify whether indexes make as big as difference as one would expect:
    1. When querying a single schema using customer-facing fields other than its primary key
    1. When joining multiple schemas to provide a denormalized view, because sometimes you wanna make life easy for front-end concerns
    1. Doing all of these things across identical databases, except that the second one has indexes
1. Log the frequency of various API requests that result in Mongo queries
1. Figure out a way diagnose performance issues in the queries

## Research

- Indexes: https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/

## Gotchas

- **Cloning databases:** Cloning a Mongo database is no longer possible via code, presumably for good reasons, so we're going to accept that NPM can and will trigger `mongoexport|mongoimport` commands indirectly, across Docker containers, through a Bash script.
- **Indexes across cloned databases:** Having two databases in the same environment that are identical in all ways but name isn't something that anyone would do in Production, but it is for our purposes since we want _identical data whose only difference is whether some fields are indexed or not_. ~~However, Mongo seemingly shares indexes across collections in different databases, so now our collections also need to be named slightly differently to avoid this.~~ Given that, and the desire to havee the same collection names for simplicity, we're going to have separate Docker containers for both databases.
- **Mongo query results are temporarily cached**, so some response times will get slightly faster over time, and then go back to ungodly slow after you step away for a cup of coffee.