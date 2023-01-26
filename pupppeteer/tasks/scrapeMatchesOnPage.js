import { scrapePlayersOfMatch } from "./scrapePlayersOfMatch.js"

export const scrapeMatchesOnPage = async ({ page, data }) => {
    try {



        await page.goto(data.url, {
            timeout: 60000,
            waitUntil: 'domcontentloaded'
        });
        await page.waitForSelector(`body > div.container-outer.seemsgood > div.skin-container > 
    div.container-inner.container-inner-content > div.content-inner > section > section > 
    article > table > tbody > tr:last-child`,
            {
                visible: true,
            })
        //.then(() => console.log('table of matches uploaded'));

        let matches = await page.evaluate(() => {
            let matchesOnPage = [...document.querySelectorAll('.cell-large>a')]
                .filter(match => match.innerText != 'No Hero')
            return matchesOnPage.map(match => match.href)
        })

        
        for (const match of matches) {
            data.cluster.queue(match, scrapePlayersOfMatch)
        }
    } catch (error) {
        console.log(error);
    }
};