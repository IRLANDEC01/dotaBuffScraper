import { Matches } from '../models/matches.js'

export const uploadMatchURL = async matchURL => {
    try {
        let match = await Matches.findOne({ matchURL })

        if (!match) {
            match = new Matches({
                matchURL
            })
            await match
                .save()
                .then(() => {
                    console.log('New match added');
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    } catch (error) {
        console.log(error);
    }
} 