import { Player } from '../../models/players.js'

export const scrapePlayersOfMatch = async ({ page, data }) => {
    try {


        await page.goto(data.matchURL, {
            timeout: 60000,
            waitUntil: 'domcontentloaded'
        });
        await page.waitForSelector(`body > div.container-outer.seemsgood > div.skin-container >
        div.container-inner.container-inner-content > div.content-inner > div.match-show > 
        div.team-results > section.dire > article > table > tbody >
         tr:nth-child(5)>td:last-child`)
        // .then(() => console.log(`The match  uploaded:\n${data.matchURL} `));

        let players = await page.evaluate(() => {
            let matchResult = document.querySelector('.match-result').classList[2];

            let playersRadiant = [...document.querySelectorAll(`body > div.container-outer.seemsgood >
        div.skin-container > div.container-inner.container-inner-content > div.content-inner >
        div.match-show > div.team-results > section.radiant > article > table > tbody > 
        tr`)]

            let playersDire = [...document.querySelectorAll(`body > div.container-outer.seemsgood > 
        div.skin-container > div.container-inner.container-inner-content > div.content-inner > 
        div.match-show > div.team-results > section.dire > article > table > tbody > 
        tr`)]
            let nickNameRadiant = [...document.querySelectorAll('.image-container-player>a')].slice(0, 5)
            let nickNameDire = [...document.querySelectorAll('.image-container-player>a')].slice(5, 10)

            let playersInfoRadiant = playersRadiant
                .map(player => {
                    return {
                        profileId: player.classList[2].slice(7),
                        nickName: player.getElementsByClassName('link-type-player')[0].innerText,
                        urlProfile: `https://ru.dotabuff.com/players/${player.classList[2].slice(7)}`,
                        totalGames: 1,
                        aspect: {
                            winForMe: matchResult == 'radiant' && nickNameRadiant
                                .find(nick => nick.lastChild.alt == "IRLANDEC") ? 1 : 0,
                            loseForMe: matchResult == 'dire' && nickNameRadiant
                                .find(nick => nick.lastChild.alt == "IRLANDEC") ? 1 : 0,
                            winAgainstMe: matchResult == 'radiant' && nickNameDire
                                .find(nick => nick.lastChild.alt == "IRLANDEC") ? 1 : 0,
                            loseAgainstMe: matchResult == 'dire' && nickNameDire
                                .find(nick => nick.lastChild.alt == "IRLANDEC") ? 1 : 0,
                            hero: {
                                dotaHero: player.getElementsByClassName('image-hero')[0].attributes.oldtitle.value,
                                count: 1
                            }
                        }
                    }
                })
                .filter(player => player.nickName != 'IRLANDEC')

            let playersInfoDire = playersDire
                .map(player => ({
                    profileId: player.classList[2].slice(7),
                    nickName: player.getElementsByClassName('link-type-player')[0].innerText,
                    urlProfile: `https://ru.dotabuff.com/players/${player.classList[2].slice(7)}`,
                    totalGames: 1,
                    aspect: {
                        winForMe: matchResult == 'dire' && nickNameDire
                            .find(nick => nick.lastChild.alt == "IRLANDEC") ? 1 : 0,
                        loseForMe: matchResult == 'radiant' && nickNameDire
                            .find(nick => nick.lastChild.alt == "IRLANDEC") ? 1 : 0,
                        winAgainstMe: matchResult == 'dire' && nickNameRadiant
                            .find(nick => nick.lastChild.alt == "IRLANDEC") ? 1 : 0,
                        loseAgainstMe: matchResult == 'radiant' && nickNameRadiant
                            .find(nick => nick.lastChild.alt == "IRLANDEC") ? 1 : 0,
                        hero: {
                            dotaHero: player.getElementsByClassName('image-hero')[0].attributes.oldtitle.value,
                            count: 1
                        }
                    }
                }))
                .filter(player => player.nickName != 'IRLANDEC')


            return [...playersInfoRadiant, ...playersInfoDire]


        })
        for (const player of players) {
            const candidate = await Player.findOne({ profileId: player.profileId })
            if (!candidate) {
                const newPlayer = new Player(player)
                await newPlayer
                    .save()
                    .then(() => {
                        //console.log('New player added');
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
                        //console.log(`Update player: ${player.nickName}`);
                    })
                    .catch((err) => {
                        console.log(error);
                    })
            }
        }

    } catch (error) {
        console.log(`ОШИБКА В PLAYEROFMATHCES\n${data.matchURL}\n${error}`);
    }
}