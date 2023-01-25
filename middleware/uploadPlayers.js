import { Player } from '../models/players.js'

export const uploadPlayer = async (playersOfMatch) => {
    for (const player of playersOfMatch) {
        const candidate = await Player.findOne({ profileId: player.profileId })
        if (!candidate) {
            const newPlayer = new Player(player)
            await newPlayer
                .save()
                .then(() => {
                    console.log('New player added');
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            candidate.totalGames += 1

            candidate.aspect.winForMe += player.aspect.winForMe
            candidate.aspect.loseForMe += player.aspect.loseForMe
            candidate.aspect.winAgainstMe += player.aspect.winAgainstMe
            candidate.aspect.loseAgainstMe += player.aspect.loseAgainstMe

            const canditateDotaHero = candidate.aspect.hero.findIndex(item => item.dotaHero == player.aspect.hero.dotaHero)
            if (canditateDotaHero != -1) {
                candidate.aspect.hero[canditateDotaHero].count += 1;
            } else {
                candidate.aspect.hero.push(player.aspect.hero)
            }
            await candidate
                .save()
                .then(() => {
                    console.log(`Update player: ${player.nickName}`);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

}