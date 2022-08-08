/* mySeedScript.js */

import { faker } from '@faker-js/faker';
import { MongoClient } from 'mongodb';

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}


// Move to Config helper
const MONGO_HOST = 'mongodb://root:example@localhost:27017';
const MONGO_HOST_B = 'mongodb://root:example@localhost:27018';

const MONGO_DATABASE_CONTROL = 'test';

const MONGO_COLLECTION_BREEDERS = 'breeders';
const MONGO_COLLECTION_OWNERS = 'owners';
const MONGO_COLLECTION_CATS = 'cats';
const MONGO_COLLECTIONS = {
    breeders: MONGO_COLLECTION_BREEDERS,
    owners: MONGO_COLLECTION_OWNERS,
    cats: MONGO_COLLECTION_CATS
};


async function initDB() {
    const client = new MongoClient(MONGO_HOST, {
        useNewUrlParser: true,
        // useUnifiedTopology: true,
    });

    const clientB = new MongoClient(MONGO_HOST_B, {
        useNewUrlParser: true,
        // useUnifiedTopology: true,
    });

    try {
        await client.connect();
        await clientB.connect();
        console.log('Connections created');

        // Reset databases
        await client.db(MONGO_DATABASE_CONTROL).dropDatabase();
        await clientB.db(MONGO_DATABASE_CONTROL).dropDatabase();

        // Test document to ensure collection appears
        const document = {
            test: true
        }

        const collections = [];
        for (let key in MONGO_COLLECTIONS) {
            const collection = MONGO_COLLECTIONS[key];

            const result = client.db(MONGO_DATABASE_CONTROL).collection(collection).insertOne(document);
            collections.push(result);
        }
        
        await Promise.all(collections).then(async e => {
            console.log('Prepared all collections');
        });

        client.close();
        clientB.close();

    } catch (err) {
        console.log('Error:', err);
    }
}

await initDB();

async function seedDB() {
    // Connection URL
    const uri = MONGO_HOST;

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        // useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log("Connected correctly to server");


        // BREEDERS
        const breeders = [];
        const breedersCollection = client.db(MONGO_DATABASE_CONTROL).collection(MONGO_COLLECTIONS.breeders);
        breedersCollection.drop();

        for (let i = 0; i < 50; i++) {
            const breederData = {
                name: faker.company.companyName() + " " + faker.company.companySuffix(),
                country: faker.address.country()
            }
            const breederResult = await breedersCollection.insertOne(breederData);
            breeders.push(breederResult.insertedId);
        }
        // console.log(breeders);
        console.log('Inserted breeders');


        // OWNERS
        const owners = [];
        const ownersCollection = client.db(MONGO_DATABASE_CONTROL).collection(MONGO_COLLECTIONS.owners);
        ownersCollection.drop();

        for (let i = 0; i < 500; i++) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();

            const ownerData = {
                email: faker.internet.email(firstName, lastName).toLowerCase(),
                firstName,
                lastName
            }
            const ownerResult = await ownersCollection.insertOne(ownerData);
            owners.push(ownerResult.insertedId);
        }
        // console.log(owners);
        console.log('Inserted owners');


        // CATS
        const collection = client.db(MONGO_DATABASE_CONTROL).collection(MONGO_COLLECTIONS.cats);

        // The drop() command destroys all data from a collection.
        // Make sure you run it against proper database and collection.
        collection.drop();


        const CATS_BATCH_NUM = 2;
        const CATS_BATCH_SIZE = 100000;

        // Thousands
        for (let j = 0; j < CATS_BATCH_NUM; j++) {
            // make a bunch of time series data
            const timeSeriesData = [];

            for (let i = 0; i < CATS_BATCH_SIZE; i++) {
                const catName = faker.random.word();    
                const breederId = breeders[Math.floor(Math.random() * breeders.length)];
                const ownerId = owners[Math.floor(Math.random() * owners.length)];
                let newDay = {
                    timestamp_day: faker.date.past(),
                    breederId,
                    ownerId,
                    cat: catName.charAt(0).toUpperCase() + catName.slice(1),
                    events: [],
                };
    
                for (let k = 0; k < randomIntFromInterval(1, 6); k++) {
                    let newEvent = {
                        timestamp_event: faker.date.past(),
                        weight: randomIntFromInterval(14,16),
                    }
                    newDay.events.push(newEvent);
                }
                timeSeriesData.push(newDay);
            }
            await collection.insertMany(timeSeriesData);    
            console.log(`Inserted ${CATS_BATCH_SIZE} cats`);
        }

        console.log("Database seeded! :)");
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

await seedDB();