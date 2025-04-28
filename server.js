import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const SMARTCRM_KEY = process.env.SMARTCRM_KEY;
const SMARTCRM_SECRET = process.env.SMARTCRM_SECRET;

app.post('/api/send', async (req, res) => {
  const { name, phone, email } = req.body;

  try {
    // 1. Створюємо клієнта
    const clientResponse = await axios.post('https://api.binotel.com/api/4.0/smartcrm/client-create.json', {
      key: SMARTCRM_KEY,
      secret: SMARTCRM_SECRET,
      pipelineId: 6046,    // твій pipeline
      stageId: 42467,      // твій етап
      budget: 0,
      customerDraft: {
        name: name,
        number: phone,
        email: email,
      }
    });

    const customerId = clientResponse.data?.result?.id;

    if (!customerId) {
      console.error('Помилка: не вдалося створити клієнта.');
      return res.status(500).json({ success: false, message: 'Не вдалося створити клієнта' });
    }

    console.log('Клієнт створений з ID:', customerId);

    // 2. Створюємо угоду і прив'язуємо клієнта
    const dealResponse = await axios.post('https://api.binotel.com/api/4.0/smartcrm/deal-create.json', {
      key: SMARTCRM_KEY,
      secret: SMARTCRM_SECRET,
      pipelineId: 6046,     // той самий pipeline
      stageId: 42467,       // той самий етап
      customerId: customerId,
      budget: 0,
      contacts: [
        {
          name: name,
          phones: [phone],
          emails: [email],
        }
      ]
    });

    console.log('Угода створена:', dealResponse.data);

    res.json({ success: true, data: dealResponse.data });

  } catch (error) {
    console.error('Помилка при надсиланні в CRM:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Помилка при надсиланні в CRM' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порті ${PORT}`));
