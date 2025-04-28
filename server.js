import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

// Правильна CORS-конфігурація
const corsOptions = {
  origin: '*',  // тільки твій сайт
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true, // Якщо потрібно (наприклад, для cookies)
};

// 1. Обов'язково CORS ставимо перед JSON парсером
app.use(cors(corsOptions));

// 2. Обов'язково приймаємо preflight OPTIONS-запити:
app.options('*', cors(corsOptions));

// 3. Далі парсимо json
app.use(express.json());

const SMARTCRM_KEY = process.env.SMARTCRM_KEY;
const SMARTCRM_SECRET = process.env.SMARTCRM_SECRET;

app.post('/api/send', async (req, res) => {
  const { name, phone, email } = req.body;

  const currentDate = new Date().toLocaleDateString(); // Отримуємо поточну дату в зручному форматі
  const dealName = `${name} - Угода від ${currentDate}`;

  try {
    // 1. Створюємо клієнта
    const clientResponse = await axios.post('https://api.binotel.com/api/4.0/smartcrm/client-create.json', {
      "name": name,
      "assignedToId": 445706,
      "email": email,
      "numbers": [phone],
      "key": SMARTCRM_KEY,
      "secret": SMARTCRM_SECRET,
    });

    // Перевірка, чи клієнт створений
    const customerId = clientResponse.data?.result?.id;

    if (!customerId) {
      console.error('Повна відповідь помилки CRM:', JSON.stringify(clientResponse.data, null, 2)); // правильне логування
      return res.status(500).json({ success: false, message: 'Не вдалося створити клієнта' });
    }

    console.log('Клієнт створений з ID:', customerId);

    // 2. Створюємо угоду і прив'язуємо клієнта
    const dealResponse = await axios.post('https://api.binotel.com/api/4.0/smartcrm/deal-create.json', {
      key: SMARTCRM_KEY,
      secret: SMARTCRM_SECRET,
      pipelineId: 6046,    // той самий pipeline
      stageId: 42467,      // той самий етап
      customerId: customerId,  // Прив'язуємо угоду до клієнта
      budget: 0,
      contacts: [
        {
          name: name,
          phones: [phone],
          emails: [email],
        }
      ],
      dealName: dealName
    });

    console.log('Угода створена:', dealResponse.data);

    res.json({ success: true, data: dealResponse.data });

  } catch (error) {
    if (error.response) {
      // Логування повної відповіді від CRM
      console.error('Повна відповідь помилки CRM:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Unknown Error:', error.message);
    }
    res.status(500).json({ success: false, message: 'Помилка при надсиланні в CRM' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порті ${PORT}`));
