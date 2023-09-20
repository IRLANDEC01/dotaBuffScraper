import puppeteer from 'puppeteer';
import { scrapeLastMatch } from './pupppeteer/tasks/scrapeLastMatch.js';
import { checkMatchID } from './middleware/checkMatchID.js'

const urlMatchesPage = 'https://dotabuff.com/players/159639310/matches'

export const scanningMatchesOnPage = async () => {
    try {


        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: false,
            timeout: 1000,
            devtools: false
        });
        const page = await browser.newPage();
        await page.goto(urlMatchesPage, {
            waitUntil: 'domcontentloaded'
        });

        await page.waitForSelector(`body > div.container-outer.seemsgood > div.skin-container > 
    div.container-inner.container-inner-content > div.content-inner > section > section > 
    article > table > tbody > tr:last-child`,
            {
                visible: true,
            })
            .then(() => console.log('table of matches uploaded'));

        setInterval(async () => {
            const lastMatchURL = await page.evaluate(() => {
                return document.querySelector(`body > div.container-outer.seemsgood >
            div.skin-container > div.container-inner.container-inner-content >
             div.content-inner > section > section > article > table > tbody > 
             tr:nth-child(1) > td:nth-child(4) > a`).href
            })

            if (!await checkMatchID(lastMatchURL)) {
                console.log('New Match');
                await scrapeLastMatch(lastMatchURL, browser)
            } else {
                console.log('This match already in DB');
            }
            await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

        }, 1000);

    } catch (error) {
        console.log(error);
    }
};