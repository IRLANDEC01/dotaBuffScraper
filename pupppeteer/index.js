import puppeteer from "puppeteer";
import { Cluster } from "puppeteer-cluster";
export const getPlayersOfMatch = async () => {
    try {
        const browser = await puppeteer.launch(
            {
                headless: false,
                devtools: true,
                defaultViewport: false,
                timeout: 1000000
            });
        const page = await browser.newPage();


        /*
           получаем все матчи
       */
        await page.goto('https://ru.dotabuff.com/players/159639310/matches?enhance=overview&page=1',
            {
                timeout: 0
            });
        await page.waitForSelector(`body > div.container-outer.seemsgood > div.skin-container > 
        div.container-inner.container-inner-content > div.content-inner > section > section > 
        article > table > tbody > tr:nth-child(50)`,
            {
                visible: true,
            })
            .then(() => console.log('table of matches uploaded'));

        let matches = await page.evaluate(() => {
            let matchesSelectors = document.querySelectorAll(`body > div.container-outer.seemsgood > 
        div.skin-container >div.container-inner.container-inner-content > div.content-inner >
         section > section > article > table > tbody > tr > td:nth-child(4)`)

            let matchesInfo = Object.values(matchesSelectors).map(
                match => ({
                    resultMatch: match.childNodes[0].className,
                    urlMatch: match.childNodes[0].href,
                    dateMatch: match.childNodes[1].childNodes[0].dateTime
                })
            )

            return matchesInfo;
        })

        /*
            получаем игроков в каждом матче
        */
        await page.goto(matches[0].urlMatch);

        await page.waitForSelector(`body > div.container-outer.seemsgood > div.skin-container > 
        div.container-inner.container-inner-content > div.content-inner > div.match-show > 
        div.team-results > section.dire > article > table > tbody > 
        tr`)
            .then(() => console.log('match result uploaded'));

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

            let playersInfoRadiant = playersRadiant
                .map(player => ({
                    profileId: player.childNodes[3].childNodes[1].href.split("players/")[1],
                    nickName: player.childNodes[3].childNodes[1].innerText,
                    urlProfile: player.childNodes[3].childNodes[1].href,
                    totalGames: 1,
                    aspect: {
                        winForMe: matchResult == 'radiant' && playersRadiant
                            .find(player => player.childNodes[3].childNodes[1].innerText == "IRLANDEC") ? 1 : 0,
                        loseForMe: matchResult == 'dire' && playersRadiant
                            .find(player => player.childNodes[3].childNodes[1].innerText == "IRLANDEC") ? 1 : 0,
                        winAgainstMe: matchResult == 'radiant' && playersDire
                            .find(player => player.childNodes[3].childNodes[1].innerText == "IRLANDEC") ? 1 : 0,
                        loseAgainstMe: matchResult == 'dire' && playersDire

                            .find(player => player.childNodes[3].childNodes[1].innerText == "IRLANDEC") ? 1 : 0,
                        hero: [{
                            dotaHero: player.childNodes[0].childNodes[0].childNodes[0].href.split("heroes/")[1],
                            count: 1
                        }]
                    }
                }))
                .filter(player => {
                    return player.nickName != 'IRLANDEC'
                })
            let playersInfoDire = playersDire
                .map(player => ({
                    profileId: player.childNodes[3].childNodes[1].href.split("players/")[1],
                    nickName: player.childNodes[3].childNodes[1].innerText,
                    urlProfile: player.childNodes[3].childNodes[1].href,
                    totalGames: 1,
                    aspect: {
                        winForMe: matchResult == 'dire' && playersDire
                            .find(player => player.childNodes[3].childNodes[1].innerText == "IRLANDEC") ? 1 : 0,
                        loseForMe: matchResult == 'radiant' && playersDire
                            .find(player => player.childNodes[3].childNodes[1].innerText == "IRLANDEC") ? 1 : 0,
                        winAgainstMe: matchResult == 'dire' && playersRadiant
                            .find(player => player.childNodes[3].childNodes[1].innerText == "IRLANDEC") ? 1 : 0,
                        loseAgainstMe: matchResult == 'radiant' && playersRadiant
                            .find(player => player.childNodes[3].childNodes[1].innerText == "IRLANDEC") ? 1 : 0,
                        hero: [{
                            dotaHero: player.childNodes[0].childNodes[0].childNodes[0].href.split("heroes/")[1],
                            count: 1
                        }]
                    }
                }))
                .filter(player => {
                    return player.nickName != 'IRLANDEC'
                })
            let playersOfMatch = [...playersInfoRadiant, ...playersInfoDire]
            return playersOfMatch;

        })
        return players;
    } catch (error) {
        console.log(error);
    }
}