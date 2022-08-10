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


const results = {};


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
 * At the moment, I need to manually update these values which is crazy.. so gotta fix this!
 * 
 * Ideally, I'd randomly select ~10 breeders and owners, and do something fancy?
 * 
 * What's super interestins is that when both of these are used,
 * we only get a few results yet the indexed database is ~95% faster?
 */

import CatModel from './models/CatModel.js';

const breederId = "62f2e2a741732eb268e4d5bc";
const ownerId = "62f2e2a841732eb268e4d766";
const catName = "Incubate";


const filter = {
    breederId: breederId,
    ownerId: ownerId
    // cat: catName
};


// const cats = await CatModel.find({});
// console.log('Cats?', cats);


for (var i = 0; i < SETS.length; i++) {
    try {
        const host = SETS[i].host;
        const id = SETS[i].id;

        const db = await mongoose.connect(host, {
          user: "root",
          pass: "example",
          dbName: MONGO_DATABASE
        });
        
        for (var j = 0; j < 20; j++) {
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


// REPORTING
// console.log('RESULTS!', results);

// This should be higher in the file
const RUNS = 50;

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


const summaryDefault = summarize(results['default']);
const summaryIndexed = summarize(results['indexed']);

const improvement = Math.round((1 - (summaryIndexed.average / summaryDefault.average)) * 100);
const msg = `
# Results

Reporting on ${summaryDefault.results}
Average (default): ${summaryDefault.average} ms 
Average (indexed): ${summaryIndexed.average} ms
Improvement vs default: ${improvement}%
`;
console.log(msg);

