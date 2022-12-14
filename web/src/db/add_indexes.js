import { MongoClient } from 'mongodb';

const MONGO_HOST_B = 'mongodb://root:example@localhost:27018';
const MONGO_DATABASE_INDEXED = 'test';

const MONGO_COLLECTION_CATS = 'cats';
const MONGO_COLLECTIONS = {
    cats: MONGO_COLLECTION_CATS
};

async function indexDB() {
    // Connection URL
    const uri = MONGO_HOST_B;

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        // useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log("Connected correctly to server");

        // CATS
        const collection = client.db(MONGO_DATABASE_INDEXED).collection(MONGO_COLLECTIONS.cats);

        // This should make a huge difference
        const result1 = await collection.createIndex({ breederId: 1 });
        console.log(`Index created: ${result1}`);

        const result2 = await collection.createIndex({ ownerId: 1 });
        console.log(`Index created: ${result2}`);

        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

await indexDB();