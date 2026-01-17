import mongoose from "mongoose";

const MockTestSchema = new mongoose.Schema({
  topic: String,
  questions: [
    {
      question: String,
      options: [String],
      answer: Number,
      explanation: String
    }
  ]
});

export default mongoose.model("MockTest", MockTestSchema);
