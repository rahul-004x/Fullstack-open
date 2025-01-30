import { useEffect, useState } from 'react';
import { Diaries } from './types';
import diaryService from './services/diaries';

const DiaryList = () => {
  const [diaries, setDiaries] = useState<Diaries[]>([]);

  useEffect(() => {
    const fetchDiaryList = async () => {
      const diaries = await diaryService.getAll();
      setDiaries(diaries);
    };
    void fetchDiaryList();
  }, []);

  return (
    <div>
      <h2>Diary entries</h2>
      {diaries.map(diary => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>Weather: {diary.weather}</p>
          <p>Visibility: {diary.visibility}</p>
        </div>
      ))}
    </div>
  );
};

export default DiaryList;
