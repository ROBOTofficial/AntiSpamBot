import { BOT_ID, BOT_TOKEN } from "$env/static/private";
import { ActivityType, Client, REST } from "discord.js";

import { INTENTS } from "./Bot.intents";
import { BotGuild } from "./Bot.guild";
import { BotInteraction } from "./Bot.interaction";
import { BotMessage } from "./Bot.message";

export class Bot {
    private readonly client = new Client({ intents: INTENTS });
    private readonly rest = new REST({ version: "10" }).setToken(BOT_TOKEN);
    private readonly botInteraction = new BotInteraction(this.client);
    private readonly botMessage = new BotMessage(this.client);
    private readonly botGuild = new BotGuild(this.client);

    public async setEvents() {
        this.client.on("ready", async (client) => {
            client.user.setActivity({
                name: "Supported by distopia.top",
                type: ActivityType.Playing,
            })
            await this.rest.put(`/applications/${BOT_ID}/commands`, {
                body: BotInteraction.commands,
            })
        });
        this.client.on("interactionCreate", async (interaction) => {
            return await this.botInteraction.create(interaction);
        });
        this.client.on("messageCreate", async (message) => {
            return await this.botMessage.create(message);
        });
		this.client.on("guildMemberAdd", async (member) => {
			return await this.botGuild.guildMemberAdd(member);
		})
    }

    public async login(): Promise<void> {
        await this.client.login(BOT_TOKEN)
    }
    public async logout(): Promise<void> {
        await this.client.destroy();
    }
}
