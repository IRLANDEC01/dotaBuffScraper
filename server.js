import express from "express";
import mongoose from "mongoose";
import { startScrape } from "./pupppeteer/testCluster.js"
import { scanningMatchesOnPage } from "./scanningMatchespage.js";
const PORT = 3000
const URL = 'mongodb://0.0.0.0:27017/dotaBuffScraper'

const app = express();
app.use(express.json())

await mongoose
    .connect(URL)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(() => console.log(`Connection DB error ${err}`))

app.listen(PORT, (err) => {
    err ? console.log('err') : console.log(`Server is started on port:${PORT}`);
})
//сбор данных с последних матчей
await startScrape()
//парсер после каждого нового матча, сканировать страницу должден автоматически
//await scanningMatchesOnPage()

