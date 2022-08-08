import mongoose from 'mongoose';


const MONGO_HOST_A = 'mongodb://localhost:27017'; // Default
const MONGO_HOST_B = 'mongodb://localhost:27018'; // Indexed
const MONGO_DATABASE = 'test';


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

const results_default = [];
const results_indexed = [];


// What's super interestins is that when both of these are used,
// we only get 40 results yet the indexed database is 95% faster?
const breederId = "62f06159911faa3bb3e3d0a6";
const ownerId = "62f06159911faa3bb3e3d0d6";
const catName = "Maroon";

const filter = {
    breederId: breederId,
    ownerId: ownerId
    // cat: catName
};


///


try {
  const db1 = await mongoose.connect(MONGO_HOST_A, {
    user: "root",
    pass: "example",
    dbName: MONGO_DATABASE
  });
} catch (err) {
  console.log(err);
}

import CatModel from './models/CatModel.js';

for (var i = 0; i < 20; i++) {
    const data = await runTest(CatModel, filter);
    results_default.push(data);
}

mongoose.disconnect();



//////



try {
    const db2 = await mongoose.connect(MONGO_HOST_B, {
        user: "root",
        pass: "example",
        dbName: MONGO_DATABASE
    });
} catch (err) {
    console.log(err);
}


for (var i = 0; i < 20; i++) {
    const data = await runTest(CatModel, filter);
    results_indexed.push(data);
}


mongoose.disconnect();



function summarize(arr) {
    let total = 0;
    arr.forEach(el => {
        total += el.ms;
    });

    return {
        results: arr[0].results,
        total,
        average: total / arr.length
    };
}

const summaryDefault = summarize(results_default);
const summaryIndexed = summarize(results_indexed);


const msg = `Results:

    Results: ${summaryDefault.results}
    Average (default): ${summaryDefault.average} ms 
    Average (indexed): ${summaryIndexed.average} ms
    % of default: ${summaryIndexed.average / summaryDefault.average}
`;
console.log(msg);
