const { Telegraf, Markup } = require('telegraf')
const mongoose = require('mongoose')
const models = require('./models')
const db = mongoose.connection
const { User } = models

mongoose.connect(
  'mongodb://localhost:27017/prettymoneybot',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

db.on('connected', () => {
  const bot = new Telegraf('1473797082:AAGPtj3EVubUJJUyJgUD8RyWKn9fFJJZNGc')

  bot.start(async (context) => {
    try {
      const { id } = context.chat
      const user = await User.findOne({ telegramId: id })

      if (!user) {
        await new User({ telegramId: id, balance: 0 }).save()
      }

      context.reply('Nice to meet you!')
    } catch (error) {
      context.reply('Something went wrong!')
    }
  })

  bot.help(context => context.reply('You don\'t need help!'))

  const inlineKeyboard = Markup.inlineKeyboard([
      Markup.callbackButton('😬 Unset', 'unset'),
      Markup.callbackButton('🤑 Add', 'add')
  ]).extra()

  bot.action('unset', (ctx) => ctx.editMessageText('👌 Done'))

  bot.action('add', (ctx) => {
    ctx.editMessageText('👌 Done')}
  )

  bot.on('text', ctx => {
    const message = ctx.message.text
    const numericMutch = message.match(/(\d+)/)
    const sum = numericMutch && +numericMutch[0] || 0

    console.log(sum)

    if (!sum) {
      return ctx.reply('Write correct operation, like: Cup a coffe 13')
    }

    return ctx.telegram.sendMessage(
      ctx.chat.id,
      'Operation?',
      inlineKeyboard
    )
  })

  bot.command('balance', async (context) => {
    try {
      const { id } = context.chat
      const user = await User.findOne({ telegramId: id })

      context.reply(`You have ${user.balance} units on your balance`)
    } catch (error) {
      context.reply('Something went wrong!')
    }
  })

  bot.launch()
})

const gracefulExit = () => { 
  // db.close(() => {
  //   process.exit(0)
  // })
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit)
