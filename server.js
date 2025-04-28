import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const SMARTCRM_KEY = 'fca8b5-75493b1';
const SMARTCRM_SECRET = '8e8f3c-7b2d22-f29dc9-ca94b6-403c299e';

app.post('/api/send', async (req, res) => {
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

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Помилка при надсиланні в CRM' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порті ${PORT}`));