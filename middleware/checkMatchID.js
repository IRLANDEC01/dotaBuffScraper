import { Matches } from '../models/matches.js'

export const checkMatchID = async matchURL => {
    try {
        return await Matches.findOne({ matchURL })
    } catch (error) {
        console.log(error);
    }
}