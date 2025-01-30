import { useState } from 'react';
import DiaryList from './DiaryList';
import AddDiaryForm from './AddDiariesModal/AddDiariesForm';
import { AddDataType } from './types';
import diaryService from './services/diaries';

const App = () => {
  const [error, setError] = useState<string>();

  const notifyError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(undefined);
    }, 5000);
  };

  const submitNewDiary = async (values: AddDataType) => {
    try {
      await diaryService.create(values);
      // Force reload of DiaryList component
      window.location.reload();
    } catch (e: unknown) {
      if (e instanceof Error) {
        notifyError(e.message);
      } else {
        notifyError('An unknown error occurred');
      }
    }
  };

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    padding: '5px',
    marginBottom: '10px',
    borderRadius: '5px'
  };

  return (
    <div>
      <h1>Flight Diaries</h1>
      <AddDiaryForm onSubmit={submitNewDiary} />
      {error && <div style={errorStyle}>{error}</div>}
      <DiaryList />
    </div>
  );
};

export default App;
