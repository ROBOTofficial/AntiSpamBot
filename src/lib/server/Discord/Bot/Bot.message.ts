import { PUBLIC_MESSAGE_LATE_LIMIT } from "$env/static/public";
import { PermissionsBitField } from "discord.js";

import type { Client, Message, OmitPartialGroupDMChannel } from "discord.js";

export type Archive = {
    guilds: Record<string, Record<string, OmitPartialGroupDMChannel<Message<boolean>>[]>>
}

export class BotMessage {
    private readonly lateLimit = Number(PUBLIC_MESSAGE_LATE_LIMIT);
    private readonly archive: Archive = {
        guilds: {},
    };

    constructor(private readonly client: Client) {
        setInterval(() => {
            for (const [guildId, users] of Object.entries(this.archive.guilds)) {
                for (const [userId, messages] of Object.entries(users)) {
                    const count = messages.length - this.lateLimit;
                    if (count >= 0) {
                        this.archive.guilds[guildId][userId] = messages.slice(this.lateLimit);
                    } else {
                        delete this.archive.guilds[guildId][userId];
                    }
                }
                if (!Object.keys(users).length) {
                    delete this.archive.guilds[guildId];
                }
            }
        }, 1000);
    }

    public async create(message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
        if (!(message.guild && message.member)) {
            return;
        }
        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return;
        }
        const guildId = message.guild.id;
        const userId = message.author.id;
        if (!this.archive.guilds[guildId]) {
            this.archive.guilds[guildId] = {};
        }
        if (!this.archive.guilds[guildId][userId]) {
            this.archive.guilds[guildId][userId] = [];
        }

        this.archive.guilds[guildId][userId].push(message);
        if (this.archive.guilds[guildId][userId].length >= this.lateLimit) {
            const messages = this.archive.guilds[guildId][userId].concat();
            delete this.archive.guilds[guildId][userId];
            for (const archiveMessage of messages) {
                try {
                    await archiveMessage.delete();
                } catch {}
            }
        }
    }
}
