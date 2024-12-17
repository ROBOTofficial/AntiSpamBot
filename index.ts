import express from "express";

import { handler } from "./build/handler";

class Main {
    private readonly app = express();

    constructor() {}

    public async load() {
        this.app.use(handler);
    }

    public async listen() {
        this.app.listen(process.env.PORT);
    }
}

const main = new Main();
await main.load();
await main.listen();
