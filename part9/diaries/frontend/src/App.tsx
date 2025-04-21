import { useState, useEffect } from 'react';
import { Diaries, Weather, Visibility } from './types';
import { getAllDiaries, createDiary } from './diaryServices';

const App = () => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState(Visibility.Great);
  const [weather, setWeather] = useState(Weather.Sunny);
  const [comment, setComment] = useState('');
  const [diaries, setDiaries] = useState<Diaries[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data);
    });
  }, []);

  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const newDiary = await createDiary({ 
        date, 
        visibility, 
        weather, 
        comment 
      });
      setDiaries(diaries.concat(newDiary));
      setDate('');
      setVisibility(Visibility.Great);
      setWeather(Weather.Sunny);
      setComment('');
      setError('');
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error.map((e: { message: string }) => e.message).join('\n'));
      } else {
        setError('Failed to create diary entry');
      }
    }
  };

  return (
    <div>
      <h1>Add A new entry</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={diaryCreation}>
        <div>
          <label>Date: </label>
          <input 
            type='date' 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <label>Visibility: </label>
          {Object.values(Visibility).map(v => (
            <label key={v}>
              <input
                type="radio"
                name="visibility"
                checked={visibility === v}
                onChange={() => setVisibility(v)}
              />
              {v}
            </label>
          ))}
        </div>
        
        <div>
          <label>Weather: </label>
          {Object.values(Weather).map(w => (
            <label key={w}>
              <input
                type="radio"
                name="weather"
                checked={weather === w}
                onChange={() => setWeather(w)}
              />
              {w}
            </label>
          ))}
        </div>
        
        <div>
          <label>Comment: </label>
          <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
          />
        </div>
        
        <button type='submit'>add</button>
      </form>
      
      <h2>Diary entries</h2>
      {diaries.map(diary => (
        <div key={diary.id} style={{ margin: '10px 0' }}>
          <h3>{diary.date}</h3>
          <p>Visibility: {diary.visibility}</p>
          <p>Weather: {diary.weather}</p>
          {diary.comment && <p>Comment: {diary.comment}</p>}
        </div>
      ))}
    </div>
  );
};

export default App;