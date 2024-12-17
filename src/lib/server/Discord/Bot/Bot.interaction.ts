import type { CacheType, Client, Interaction } from "discord.js";

export class BotInteraction {
    public static commands = [];

    constructor(private readonly client: Client) {}

    public async create(interaction: Interaction<CacheType>): Promise<void> {}
}
