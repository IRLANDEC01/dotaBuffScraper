import scrapePlayersOfMatch from "./tasks/scrapePlayersOfMatch"


export default scrapeMatchesOnPage = async ({ page, data: url }) => {
    await page.goto(url);

    await page.waitForSelector(`body > div.container-outer.seemsgood > div.skin-container > 
    div.container-inner.container-inner-content > div.content-inner > section > section > 
    article > table > tbody > tr:nth-child(50)`,
        {
            visible: true,
        })
        .then(() => console.log('table of matches uploaded'));

    let matches = await page.evaluate(() => {
        let matchesOnPage = [...document.querySelectorAll('.lost'), ...document.querySelectorAll('.won')]
        return matchInfo = matchesOnPage.map(
            match => ({
                matchURL: match.href,
                matchDate: match.nextSibling.firstChild.dateTime
            })
        )
    })
    console.log(matches.length);
    for (const match of matches) {
        cluster.queue(match.matchURL, scrapePlayersOfMatch);
    }

};