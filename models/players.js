import mongoose from "mongoose";

const Schema = mongoose.Schema

const playerSchema = new Schema({
    profileId: {
        type: Number,
        required: true
    },
    nickName: {
        type: String,
        required: true
    },
    totalGames: {
        type: Number,
        default: 0
    },
    aspect: {
        winForMe: {
            type: Number,
            default: 0
        },
        loseForMe: {
            type: Number,
            default: 0
        },
        winAgainstMe: {
            type: Number,
            default: 0
        },
        loseAgainstMe: {
            type: Number,
            default: 0
        },
        hero: [{
            dotaHero: String,
            count: {
                type: Number,
                default: 0
            }
        }]
    }

})
export const Player = mongoose.model('Player', playerSchema)