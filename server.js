import express from "express";
import mongoose from "mongoose";
import { Player } from "./models/players.js"
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

await startScrape()
//await scanningMatchesOnPage()


app.get('/players', (req, res) => {
    Player
        .find()
        .then((players) => {
            res
                .status(200)
                .json(players)

        })
        .catch((err) => {
            res
                .status(500)
                .json({ "err": 'Some error' })
        })
})
app.post('/add', (req, res) => {
    const player = new Player(gamers[0])
    player
        .save()
        .then((result) => {
            res
                .status(200)
                .json(result)

        })
        .catch((err) => {
            res
                .status(500)
                .json({ "err": err })
        })
})
app.patch('/players/:id', (req, res) => {
    Player
        .findByIdAndUpdate(req.params.id, {
            totalGames: 100,
            aspect: {
                winForMe: 1,
                hero: [{
                    dotahero: 'razor',
                    count: 1
                }]
            }
        })
        .then((result) => {
            res
                .status(200)
                .json(result)

        })
        .catch((err) => {
            res
                .status(500)
                .json({ "err": err })
        })
})



