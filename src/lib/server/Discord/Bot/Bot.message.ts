import type { Client, Message, OmitPartialGroupDMChannel } from "discord.js";

export class BotMessage {
    constructor(private readonly client: Client) {}

    public async create(message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {}
}
