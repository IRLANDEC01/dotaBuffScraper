import mongoose from "mongoose";

const Schema = mongoose.Schema

const matchesSchema = new Schema({
    matchURL: {
        type: String,
        required: true
    }

})
export const Matches = mongoose.model('matches', matchesSchema)