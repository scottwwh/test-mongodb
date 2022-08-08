import mongoose from 'mongoose';
const { Schema } = mongoose;

const catSchema = new Schema({
  events: Schema.Types.Mixed,
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "Owner"
  },
  breederId: Schema.Types.ObjectId,
  timestamp_day: Date,
  cat: String
});

const CatModel = mongoose.model('Cat', catSchema);

export default CatModel;