
// SQS
// const config = require('./config');
// const ServiceApp = require('./ServiceApp');
// const service = new ServiceApp(config);

// App
// const fs = require('fs');
// const path = require('path');
import Koa from 'koa';
// const serve = require('koa-static')
// const bodyParser = require('koa-bodyparser');
import Router from '@koa/router';

// import mongoose from 'mongoose';


// const MONGO_HOST = 'mongodb://root:example@localhost:27017';
// // const MONGO_HOST = 'mongodb://localhost:27017';
// const MONGO_DATABASE_CONTROL = 'test';

// try {
//   const db1 = await mongoose.connect(`${MONGO_HOST}/${MONGO_DATABASE_CONTROL}`);
// } catch (err) {
//   console.log(err);
// }


// import OwnerModel from './OwnerModel.js';

// const testName = 'Dean';

// const results = await OwnerModel.find({
//   firstName: testName
// });

// console.log('Matches for:', results);


const router = new Router();

// const webRoot = path.join(__dirname, '..', config.WEB_PUBLIC);
const app = new Koa();
// app.use(bodyParser());
// app.use(serve(webRoot));

router.get('/', list)
//   // Users
//   .post('/api/users/', addUser)
//   .get('/api/users/', getAllUsers)
//   .get('/api/users/:id', getUser)
//   // Notifications
//   .get('/api/notifications/:id', sendNotification)
//   .patch('/api/notifications/:id', updateNotifications)

// Display home page
async function list(ctx) {
//   const file = path.join(webRoot, 'index.html')
  ctx.response.type = 'text/html';
  ctx.response.body = `
  <html>
    <div style="text-align: center">
      <h1>This page does nothing yet!</h1>
      <p>Interactive test results are out of scope - check the README :)</p>
    </div>
  </html>
`;
  
};

// // Get data for specific user
// async function getUser(ctx) {
//   const id = ctx.params.id;
//   try {
//     const data = await service.getUser(id);
//     ctx.response.body = data;
//   } catch (err) {
//     console.log(err);
//     ctx.response.body = "NOK";
//   }
// };

// // Get list of all users
// async function getAllUsers(ctx) {
//   try {
//     const users = await service.getAllUsers();
//     ctx.response.body = users;
//   } catch (err) {
//     console.log(err);
//     ctx.response.body = "NOK";
//   }
// };

// // TBD: Is this clean enough to stay here?
// async function addUser(ctx) {
//   const name = ctx.request.body.name;

//   try {
//     const uuid = await service.addUser(name);
//     ctx.response.body = {
//       status: "ACK",
//       id: uuid
//     };
//   } catch (err) {
//     console.log(err);
//     ctx.response.body = "NOK";
//   }
// };

// async function sendNotification(ctx) {
//   try {
//     if (ctx.params && ctx.params.id) {
//       await service.sendNotification(ctx.params.id);
//     }

//     ctx.response.body = "ACK";
//   } catch (err) {
//     console.log(err);
//     ctx.response.body = "NOK";
//   }
// };

// // Set notifications to 0
// async function updateNotifications(ctx) {
//   try {
//     let data = [];
//     if (ctx.params && ctx.params.id) {
//       const ids = ctx.params.id.split(',');
//       for (var i = 0; i < ids.length; i++) {
//         const res = await service.updateNotifications(ids[i]);
//         data.push(res);
//       }
//     }

//     ctx.response.body = {
//       status: "ACK",
//       notifications: data
//     };
//   } catch (err) {
//     console.log(err);
//     ctx.response.body = "NOK";
//   }
// };

const PORT = 3000;

app.use(router.routes());
app.listen(PORT);
console.log(`App launched on port ${PORT}`);

// (async () => {
//   try {
//     await service.init();
//   } catch (err) {
//     console.log('Could not initialize ServiceApp:', err);
//   }
// })();