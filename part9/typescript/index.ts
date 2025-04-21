import express from 'express';

import { bmiCalculator } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
const PORT = 3004;

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
    res.status(400).json({ error: 'malformatted parameters' });
  }

  const heightNum = Number(height);
  const weightNum = Number(weight);

  const bmi = bmiCalculator(weightNum, heightNum);

  res.json({
    weight: weightNum,
    height: heightNum,
    bmi,
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || target === undefined) {
    res.status(400).json({ error: 'parameters missing' });
  }

  if (!Array.isArray(daily_exercises)) {throw new Error('daily_exercises must be an array');};

  const dailyHours = daily_exercises.map((hour) => Number(hour));
    

  // Calculate exercise results
  try {
    const result = calculateExercises(dailyHours, Number(target));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: `Something went wrong, ${error}` });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
