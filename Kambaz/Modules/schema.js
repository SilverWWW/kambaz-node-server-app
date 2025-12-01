import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  module: String,
}, { _id: false });

const moduleSchema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  course: String,
  lessons: [lessonSchema],
}, { collection: "modules" });

export default moduleSchema;

