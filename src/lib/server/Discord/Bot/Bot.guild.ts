import type { Client, GuildMember } from "discord.js";

export class BotGuild {
    constructor(private readonly client: Client) {}

    public async guildMemberAdd(member: GuildMember): Promise<void> {}
}
