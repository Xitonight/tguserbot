import { Dispatcher, filters } from "@mtcute/dispatcher";
import { md, TelegramClient } from "@mtcute/node";
import { env } from "./env.js";

const tg = new TelegramClient({
  "apiId": env.API_ID,
  "apiHash": env.API_HASH,
  "storage": "sessions/xitonight",
});

const dp = Dispatcher.for(tg);

const allowedIds = [611938392];

dp.onNewMessage(
  filters.userId(8015642419),
  async (upd) => {
    upd.react({ "emoji": "🤓" });
  },
);

dp.onNewMessage(
  filters.and(filters.userId(allowedIds), filters.command(["uid", "userid"])),
  async (upd) => {
    const replyTo = await upd.getReplyTo();
    await upd.edit({
      "text": md`**User ID**: ${replyTo?.sender.id || upd.sender.id}`,
    });
  },
);

dp.onNewMessage(
  filters.and(filters.userId(allowedIds), filters.command(["chid", "chatid"])),
  async (upd) => {
    await upd.edit({ "text": md`**Chat ID**: ${upd.chat.id}` });
  },
);

dp.onNewMessage(
  filters.and(filters.userId(allowedIds), filters.command(["msgid", "id"])),
  async (upd) => {
    const replyTo = await upd.getReplyTo();
    await upd.edit({ "text": md`**Message ID**: ${replyTo?.id || upd.id}` });
  },
);

const abortController = new AbortController();

// Handle termination signals
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, aborting...");
  abortController.abort();
});

process.on("SIGINT", () => {
  console.log("Received SIGINT, aborting...");
  abortController.abort();
});

const user = await tg.start({
  "phone": env.PHONE_NUMBER,
  "password": env.TG_PASSWORD,
  "abortSignal": abortController.signal,
});

console.log("Logged in as", user.username);

abortController.signal.addEventListener("abort", () => {
  console.log("Bot is shutting down gracefully...");
  // mtcute handles the cleanup internally
  process.exit(0);
});
