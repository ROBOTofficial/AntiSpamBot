import { Bot } from "./Bot/index";
import { Oauth } from "./Oauth/index";

class Discord {
    public readonly bot = new Bot();
    public readonly oauth = new Oauth();
}

export const discord = new Discord();
