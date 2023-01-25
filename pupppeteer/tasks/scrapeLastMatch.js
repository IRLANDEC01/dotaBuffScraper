import { uploadMatchURL } from "../../middleware/uploadMatchURL.js";
import { uploadPlayer } from "../../middleware/uploadPlayers.js";

export const scrapeLastMatch = async (matchURL, browser) => {
    try {
        const page = await browser.newPage();
        await page.goto(matchURL, {
            waitUntil: 'domcontentloaded'
        });
        await page.waitForSelector(`body > div.container-outer.seemsgood > div.skin-container >
    div.container-inner.container-inner-content > div.content-inner > div.match-show > 
    div.team-results > section.dire > article > table > tbody >
     tr:nth-child(5)>td:last-child`)
            .then(() => console.log(`The last match  uploaded:\n${matchURL} `));


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
        await uploadMatchURL(matchURL)
        await uploadPlayer(players)
        await page.close()
    } catch (error) {
        console.log(error);
    }
}