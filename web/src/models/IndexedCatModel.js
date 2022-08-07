import mongoose from 'mongoose';
const { Schema } = mongoose;

const catSchema = new Schema({
  events: Schema.Types.Mixed,
  ownerId: Schema.Types.ObjectId,
  breederId: Schema.Types.ObjectId,
  timestamp_day: Date,
  cat: String
});

const IndexedCatModel = mongoose.model('Indexed_Cat', catSchema);

export default IndexedCatModel;