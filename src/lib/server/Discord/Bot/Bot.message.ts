import { PUBLIC_MESSAGE_LATE_LIMIT } from "$env/static/public";
import { PermissionsBitField } from "discord.js";

import type { Client, Message, OmitPartialGroupDMChannel } from "discord.js";

export class BotMessage {
    private readonly lateLimit = Number(PUBLIC_MESSAGE_LATE_LIMIT);
    private users: Record<string, number> = {};

    constructor(private readonly client: Client) {
        setInterval(() => {
            for (const [userId, count] of Object.entries(this.users)) {
                if ((count - this.lateLimit) >= 0) {
                    this.users[userId] = count - this.lateLimit;
                } else {
                    delete this.users[userId];
                }
            }
        }, 1000);
    }

    public async create(message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
        if (!message.member) {
            return;
        }
        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return;
        }
        const userId = message.author.id;
        if (!this.users[userId]) {
            this.users[userId] = 0;
        }
        this.users[userId]++;
        if (this.users[userId] >= this.lateLimit) {
            await message.delete();
        }
    }
}
