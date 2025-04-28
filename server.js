import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const SMARTCRM_KEY = process.env.SMARTCRM_KEY;
const SMARTCRM_SECRET = process.env.SMARTCRM_SECRET;

app.post('/api/send', async (req, res) => {
  console.log('Отримано запит на /api/send:', req.body); 
  const { name, phone, email } = req.body;

  try {
    const response = await axios.post('https://api.binotel.com/api/4.0/smartcrm/deal', {
      key: SMARTCRM_KEY,
      secret: SMARTCRM_SECRET,
      pipelineId: 6046,
      stageId: 42467,
      contact: {
        name,
        phone,
        email,
      },
    });
 console.log('Відповідь від CRM:', response.data); 
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Помилка при надсиланні в CRM:', error.response?.data || error.message);
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Помилка при надсиланні в CRM' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порті ${PORT}`));
