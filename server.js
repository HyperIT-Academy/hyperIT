import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

//CORS-конфігурація
const corsOptions = {
  origin: 'https://hyperitacademy.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

const SMARTCRM_KEY = process.env.SMARTCRM_KEY;
const SMARTCRM_SECRET = process.env.SMARTCRM_SECRET;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post('/api/send', async (req, res) => {
  const { name, phone, email } = req.body;

  const currentDateTime = new Date().toLocaleString('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const dealName = `${name} - Угода від ${currentDateTime}`;

    const telegramMessage = `
📩 Нова заявка з Facebook:

👤 Ім'я: ${name}
🔗 Email: ${email}
📱 Телефон: ${phone}

🕒 ${currentDateTime}
`;

  try {
    // Надсилаємо повідомлення в Telegram
    axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: telegramMessage,
    }).catch(err => {
      console.error('Помилка Telegram:', err.message);
    });
    
    // //CRM:Створюємо клієнта
    // const clientResponse = await axios.post('https://api.binotel.com/api/4.0/smartcrm/client-create.json', {
    //   "name": name,
    //   "assignedToId": 445706,
    //   "email": email,
    //   "numbers": [phone],
    //   "key": SMARTCRM_KEY,
    //   "secret": SMARTCRM_SECRET,
    // });

    // // Перевірка, чи клієнт створений
    // const customerId = clientResponse.data?.result?.id;

    // if (!customerId) {
    //   console.error('Повна відповідь помилки CRM:', JSON.stringify(clientResponse.data, null, 2));
    //   return res.status(500).json({ success: false, message: 'Не вдалося створити клієнта' });
    // }

    // console.log('Клієнт створений з ID:', customerId);

    // //CRM:Створюємо угоду і прив'язуємо клієнта
    // const dealResponse = await axios.post('https://api.binotel.com/api/4.0/smartcrm/deal-create.json', {
    //   name: dealName,
    //   key: SMARTCRM_KEY,
    //   secret: SMARTCRM_SECRET,
    //   pipelineId: 6046,
    //   stageId: 42467,
    //   customerId: customerId,
    //   budget: 0,
    //   contacts: [
    //     {
    //       name: name,
    //       phones: [phone],
    //       emails: [email],
    //     }
    //   ]
    // });

    // console.log('Угода створена:', dealResponse.data);

    // res.json({ success: true, data: dealResponse.data });

  } catch (error) {
    if (error.response) {
      console.error('Повна відповідь помилки CRM:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Unknown Error:', error.message);
    }
    res.status(500).json({ success: false, message: 'Помилка при надсиланні в CRM' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порті ${PORT}`));
