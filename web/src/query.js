import mongoose from 'mongoose';

const MONGO_DATABASE = 'test';
const MONGO_HOST_A = 'mongodb://localhost:27017'; // Default
const MONGO_HOST_B = 'mongodb://localhost:27018'; // Indexed


const SET_DEFAULT = 'default';
const SET_INDEXED = 'indexed';


const SETS = [
    {
        // const results_default = [];
        // const results_indexed = [];
        id: SET_DEFAULT,
        host: MONGO_HOST_A
    },
    {
        id: SET_INDEXED,
        host: MONGO_HOST_B
    }

    // MONGO_HOST_A,
    // MONGO_HOST_B
];


// Remap the above
const SET_IDS = [
    SET_DEFAULT,
    SET_INDEXED
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

// const results_default = [];
// const results_indexed = [];


/**
 * SAMPLE SET
 * 
 * At the moment, I need to manually update these values which is crazy.. so gotta fix this!
 * 
 * Ideally, I'd randomly select ~10 breeders and owners, and do something fancy?
 */

// What's super interestins is that when both of these are used,
// we only get a few results yet the indexed database is ~95% faster?
const breederId = "62f2e2a741732eb268e4d5bc";
const ownerId = "62f2e2a841732eb268e4d766";
const catName = "Incubate";


const filter = {
    breederId: breederId,
    ownerId: ownerId
    // cat: catName
};


///

import CatModel from './models/CatModel.js';
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
            // results_default.push(data);
            if (!results[id]) {
                // results[name].push(data);
                results[id] = [];
            // } else {
            }

            results[id].push(data);
        }
        
        mongoose.disconnect();
      } catch (err) {
        console.log(err);
      }
}

// Debug
// console.log('RESULTS!', results);


//////


/*
try {
    const db2 = await mongoose.connect(MONGO_HOST_B, {
        user: "root",
        pass: "example",
        dbName: MONGO_DATABASE
    });
} catch (err) {
    console.log(err);
}


// This may be a good way to mimic where we need caching (or where Mongo provides it?)
for (var i = 0; i < RUNS; i++) {
    const data = await runTest(CatModel, filter);
    results_indexed.push(data);
}


mongoose.disconnect();
*/


// REPORTING


const RUNS = 50;


function summarize(arr) {
    // console.log(arr);

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


// const summaryDefault = summarize(results['default']);
// const summaryIndexed = summarize(results['indexed']);
const summaryDefault = summarize(results['default']);
const summaryIndexed = summarize(results['indexed']);


const msg = `Results:

    Results: ${summaryDefault.results}
    Average (default): ${summaryDefault.average} ms 
    Average (indexed): ${summaryIndexed.average} ms
    % of default: ${summaryIndexed.average / summaryDefault.average}
`;
console.log(msg);
