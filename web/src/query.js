import mongoose from 'mongoose';

const MONGO_DATABASE = 'test';
const MONGO_HOST_A = 'mongodb://localhost:27017'; // Default
const MONGO_HOST_B = 'mongodb://localhost:27018'; // Indexed

const SET_DEFAULT = 'default';
const SET_INDEXED = 'indexed';
const SETS = [
    {
        id: SET_DEFAULT,
        host: MONGO_HOST_A
    },
    {
        id: SET_INDEXED,
        host: MONGO_HOST_B
    }
];


// May be risky because it doesn't enforce set, or maybe this doesn't need to be a function?
async function runTest(Model, filter) {
    const ts = new Date();

    const results = await Model.find(filter);
    
    const tn = new Date();
    const diff = tn.getTime() - ts.getTime();
    
    return {
        model: Model,
        results: results.length,
        ms: diff
    }
}



/**
 * SAMPLE SET
 * 
 * Ideally, I'd randomly select ~10 cats (for their breeders and owners) and then iterate through that list as well
 * 
 * Note: When our query filters include two fields but but results (~10), the indexed database is ~95% faster?
 */

const filter = {
    breederId: null,
    ownerId: null
    // cat: catName
};

import CatModel from './models/CatModel.js';

async function generateResults(runs) {
    const results = {};

    for (var i = 0; i < SETS.length; i++) {
        try {
            const host = SETS[i].host;
            const id = SETS[i].id;

            const db = await mongoose.connect(host, {
                user: "root",
                pass: "example",
                dbName: MONGO_DATABASE
            });


            // Get record(s) from the first host/database only (documents are identical)
            if (i == 0) {
                const cat = await CatModel.findOne();
                // console.log('Cats?', cat);

                filter.breederId = cat.breederId;
                filter.ownerId = cat.ownerId;
            }

            
            for (var j = 0; j < runs; j++) {
                const data = await runTest(CatModel, filter);

                // Create array if missing
                if (!results[id]) {
                    results[id] = [];
                }

                results[id].push(data);
            }
            
            mongoose.disconnect();
        } catch (err) {
            console.log(err);
        }
    }
    
    return results;
}


// REPORTING - this should be in the our tests!

function summarize(arr) {
    let total = 0;
    arr.forEach(el => {
        total += el.ms;
    });

    return {
        results: arr[0].results + ' results over ' + RUNS + ' runs',
        total,
        average: total / arr.length
    };
}


// This could be used to test short-term caching behaviour (where more duplicate reads leads to fast response times?)
const RUNS = 50;
const results = await generateResults(RUNS);
// console.log('RESULTS!', results);


const summaryDefault = summarize(results['default']);
const summaryIndexed = summarize(results['indexed']);

const improvement = Math.round((1 - (summaryIndexed.average / summaryDefault.average)) * 100);
const msg = `
# Results

Filter:
- Breeder: ${filter.breederId}
- Owner: ${filter.ownerId}

Reporting on ${summaryDefault.results}
Average (default): ${summaryDefault.average} ms 
Average (indexed): ${summaryIndexed.average} ms
Improvement vs default: ${improvement}%
`;
console.log(msg);

