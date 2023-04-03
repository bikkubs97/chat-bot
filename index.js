
import TelegramBot from "node-telegram-bot-api";
import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";


config()

const TOKEN = process.env.TELEGRAM_TOKEN

const bot = new TelegramBot(TOKEN, {polling:true} )

const openai = new OpenAIApi(new Configuration({
    apiKey:process.env.CHATGPT_API
}))

let firstMsg = true;

bot.on('message', (message)=>{
    if (firstMsg) {
        bot.sendMessage(message.chat.id, `Hello ${message.chat.first_name}, use "/prompt" followed by your query`)
        firstMsg = false
    }
})


bot.onText(/\/prompt (.+)/, (msg, match) => {
    const chatId = msg.chat.id
    const messageText = match[1]

    

    openai.createChatCompletion({
        model:"gpt-3.5-turbo",
        messages:[{role:"user", content:messageText}]
    }).then(res=>{
        const result = (res.data.choices[0].message.content) 
        bot.sendMessage(chatId, result);
    })
    

  });
  
