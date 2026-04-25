import { Dispatcher, filters } from "@mtcute/dispatcher";
import { md, TelegramClient } from "@mtcute/node";
import { env } from "./env.js";

const tg = new TelegramClient({
  apiId: env.API_ID,
  apiHash: env.API_HASH,
  storage: "sessions/xitonight",
});

const dp = Dispatcher.for(tg);

dp.onNewMessage(
  filters.and(filters.userId(611938392), filters.command("id")),
  async (upd) => {
    const replyTo = await upd.getReplyTo();
    await upd.delete();
    await upd.replyText(
      md`**User ID**: ${replyTo ? replyTo.sender.id : upd.sender.id}`,
    );
  },
);

const user = await tg.start({
  phone: env.PHONE_NUMBER,
  password: env.TG_PASSWORD,
});

console.log("Logged in as", user.username);
