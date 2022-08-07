import mongoose from 'mongoose';
const { Schema } = mongoose;

const ownerSchema = new Schema({
  email: String,
  firstName: String,
  firstName: String
});

const OwnerModel = mongoose.model('Owner', ownerSchema);

export default OwnerModel;