import { Cluster } from "puppeteer-cluster";
import { scrapeMatchesOnPage } from "./tasks/scrapeMatchesOnPage.js"
import proxyChain from "proxy-chain";


const countPagesOnDotaBuff = 10;
const oldProxyUrl = 'http://bob:password123@85.14.243.31:3128';
const newProxyUrl = await proxyChain.anonymizeProxy({ url: oldProxyUrl });

export const startScrape = async () => {
    try {

        

        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            maxConcurrency: 8,
            retryLimit: 3,
            monitor:true,
            puppeteerOptions: {
                headless: false,
                defaultViewport: false,
                timeout: 60000,
                args: [`--proxy-server=${newProxyUrl}`]
            }
        });

        cluster.on('taskerror', (err, data) => {
            console.log(`  Error crawling ${data}: ${err.message}`);
        });

        for (let page = 1; page <= countPagesOnDotaBuff; page++) {
            await cluster
                .queue({
                    url: `https://dotabuff.com/players/159639310/matches?enhance=overview&page=${page}`,
                    cluster
                },
                    scrapeMatchesOnPage);
        }
       // await proxyChain.closeAnonymizedProxy(newProxyUrl, true);
        await cluster.idle();
        await cluster.close();
    } catch (error) {
        console.log(error);
    }

}