import { Dispatcher, filters } from "@mtcute/dispatcher";
import { md, TelegramClient } from "@mtcute/node";
import { env } from "./env.js";

const tg = new TelegramClient({
  apiId: env.API_ID,
  apiHash: env.API_HASH,
  storage: "sessions/xitonight",
});

const dp = Dispatcher.for(tg);

const allowedIds = [611938392];

dp.onNewMessage(
  filters.and(filters.userId(allowedIds), filters.command("id")),
  async (upd) => {
    const replyTo = await upd.getReplyTo();
    await upd.edit({
      text: md`**User ID**: ${replyTo?.sender.id || upd.sender.id}`,
    });
  },
);

dp.onNewMessage(
  filters.and(filters.userId(allowedIds), filters.command("chid")),
  async (upd) => {
    await upd.edit({ text: md`**Chat ID**: ${upd.chat.id}` });
  },
);

dp.onNewMessage(
  filters.and(filters.userId(allowedIds), filters.command("msgid")),
  async (upd) => {
    const replyTo = await upd.getReplyTo();
    await upd.edit({ text: md`**Message ID**: ${replyTo?.id || upd.id}` });
  },
);

const user = await tg.start({
  phone: env.PHONE_NUMBER,
  password: env.TG_PASSWORD,
});

console.log("Logged in as", user.username);
