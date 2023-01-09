import { Cluster } from "puppeteer-cluster";
import scrapeMatchesOnPage from "./tasks/scrapePlayersOfMatch"

const countPagesOnDotaBuff = 1;

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: 6,
        puppeteerOptions: {
            headless: false,
            devtools: true,
            defaultViewport: false,
            timeout: 1000000
        }
    });

    cluster.on('taskerror', (err, data) => {
        console.log(`  Error crawling ${data}: ${err.message}`);
    });

    for (let page = 1; page <= countPagesOnDotaBuff; page++) {
        await cluster
            .queue(`https://ru.dotabuff.com/players/159639310/matches?enhance=overview&page=${page}`,
                scrapeMatchesOnPage);
    }
    // await cluster.idle();
    // await cluster.close();
})();