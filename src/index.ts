import { Client } from 'whatsapp-web.js'
import { generate as printQR } from 'qrcode-terminal'

const client = new Client({})

console.log('Fetching QR')

client.on('qr', (qr) => {
  console.log('QR Received')
  printQR(qr, { small: true })
})

client.on('ready', async () => {
  console.log('Logged in!')

  const chats = await client.getContacts()
  const chat = await chats[0].getChat()
  console.log(chat)

  await client.logout()
})

client.initialize()
