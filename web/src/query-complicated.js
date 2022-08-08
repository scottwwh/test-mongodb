import mongoose from 'mongoose';


const MONGO_HOST = 'mongodb://localhost:27017';
const MONGO_DATABASE_CONTROL = 'test';
const MONGO_DATABASE_INDEXED = 'test_indexed';



// async function runTest(Model, filter) {
//     const ts = new Date();

//     const results = await Model.find(filter);
    
//     const tn = new Date();
//     const diff = tn.getTime() - ts.getTime();
    
//     return {
//         model: Model,
//         results: results.length,
//         ms: diff
//     }
// }

const results_default = [];
const results_indexed = [];


const breederId = "62f0308bacca60784a93d266";
const catName = "Cyan";

const filter = {
    breederId: breederId
    // cat: catName
};


///


try {
  const db1 = await mongoose.connect(MONGO_HOST, {
    user: "root",
    pass: "example",
    // dbName: MONGO_DATABASE_CONTROL
    dbName: MONGO_DATABASE_INDEXED
  });
} catch (err) {
  console.log(err);
}


import Cat from './models/CatModel.js';
import IndexedCat from './models/IndexedCatModel.js';

// import Owner from './models/OwnerModel.js';
// import OwnerModel from './models/OwnerModel.js';


// for (var i = 0; i < 20; i++) {
//     const data = await runTest(CatModel, filter);
//     results_default.push(data);
// }


// const users = await OwnerModel.aggregate([
//     {
//       $match: {
//         _id: "62f03c3e046a7521dbcbb34d"
//       }
//     },
//     {
//       $lookup: {
//         from: 'cats', // secondary db
//         localField: '_id',
//         foreignKey: 'ownerId',
//         as: 'subscription' // output to be stored
//       }
//     }
// ]);


// const cat = await Cat.find({ _id: "62f03c40046a7521dbcbb567" }).populate("ownerId");
const ts = new Date();
// const cat = await Cat.find({ ownerId: "62f03c40046a7521dbcbb532" });
const cat = await IndexedCat.find({ ownerId: "62f03c40046a7521dbcbb532" });
const tn = new Date();
console.log(cat.length, 'results in', tn.getTime() - ts.getTime(), 'ms');


mongoose.disconnect();



//////



// try {
//     const db2 = await mongoose.connect(MONGO_HOST, {
//         user: "root",
//         pass: "example",
//         dbName: MONGO_DATABASE_INDEXED
//     });
// } catch (err) {
//     console.log(err);
// }

// import IndexedCatModel from './IndexedCatModel.js';

// for (var i = 0; i < 20; i++) {
//     const data = await runTest(IndexedCatModel, filter);
//     results_indexed.push(data);
// }


// mongoose.disconnect();



// function summarize(arr) {
//     let total = 0;
//     arr.forEach(el => {
//         total += el.ms;
//     });

//     return {
//         total,
//         average: total / arr.length
//     };
// }

// const summaryDefault = summarize(results_default);
// const summaryIndexed = summarize(results_indexed);


// const msg = `Results:

//     Average (default): ${summaryDefault.average} ms 
//     Average (indexed): ${summaryIndexed.average} ms
//     % of default: ${summaryIndexed.average / summaryDefault.average}
// `;
// console.log(msg);
