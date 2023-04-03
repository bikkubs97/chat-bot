import TelegramBot from "node-telegram-bot-api";
import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";

config()

const TOKEN = process.env.TELEGRAM_TOKEN

const bot = new TelegramBot(TOKEN, { polling: true })

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.CHATGPT_API
}))

let firstMsg = true;

bot.on('message', (message) => {
  if (firstMsg) {
    bot.sendMessage(message.chat.id, `Hello ${message.chat.first_name}, use "/prompt" followed by your query`)
    firstMsg = false
  }
})

bot.onText(/\/prompt (.+)/, (msg, match) => {
  const chatId = msg.chat.id
  const messageText = match[1]

  // Send a request to check if another instance of the bot is running
  bot.getUpdates().then(updates => {
    if (updates.length > 0) {
      // If updates are returned, another instance is running.
      // Send a message to notify the user and terminate this instance.
      bot.sendMessage(chatId, "Another instance of the bot is already running. Please try again later.")
      process.exit()
    } else {
      // If no updates are returned, no other instance is running.
      // Continue with the chat completion request.
      openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: messageText }]
      }).then(res => {
        const result = (res.data.choices[0].message.content)
        bot.sendMessage(chatId, result);
      })
    }
  })

});
