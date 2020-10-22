import { Client } from 'whatsapp-web.js'
import { generate as printQR } from 'qrcode-terminal'
import { createObjectCsvWriter as createCsv } from 'csv-writer'

const csvWriter = createCsv({
  path: 'out/out.csv',
  header: [
    { id: 'number', title: 'Number' },
    { id: 'pushname', title: 'Pushname' },
  ],
})

const client = new Client({})

console.log('Fetching QR')

client.on('qr', (qr) => {
  console.log('QR Received')
  printQR(qr, { small: true })
})

client.on('ready', async () => {
  console.log('Logged in!')

  const chats = await client.getContacts()

  const data = chats.reduce(
    (acc, cur) =>
      !Boolean(cur.name) && !Boolean(cur.isGroup) ? [...acc, { number: cur.number, pushname: cur.pushname }] : acc,
    []
  )

  console.table(data.slice(0, 30))

  await csvWriter.writeRecords(data)

  console.log('Output written!')

  await client.logout()
})

client.initialize()
