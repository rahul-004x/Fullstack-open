import { useState, SyntheticEvent } from 'react';
import { AddDataType, Weather, Visibility } from '../types';

interface Props {
  onSubmit: (values: AddDataType) => void;
}

interface WeatherOption {
  value: Weather;
  label: string;
}

interface VisibilityOption {
  value: Visibility;
  label: string;
}

const weatherOptions: WeatherOption[] = Object.values(Weather).map(v => ({
  value: v, label: v.toString()
}));

const visibilityOptions: VisibilityOption[] = Object.values(Visibility).map(v => ({
  value: v, label: v.toString()
}));

const AddDiaryForm = ({ onSubmit }: Props) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState('');

  const addDiary = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      date,
      visibility,
      weather,
      comment
    });
  };

  return (
    <form onSubmit={addDiary}>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
      </div>
      <div>
        <label>Visibility:</label>
        <div>
          {visibilityOptions.map(option => (
            <label key={option.value} style={{ marginRight: '1rem' }}>
              <input
                type="radio"
                name="visibility"
                value={option.value}
                checked={visibility === option.value}
                onChange={({ target }) => setVisibility(target.value as Visibility)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label>Weather:</label>
        <div>
          {weatherOptions.map(option => (
            <label key={option.value} style={{ marginRight: '1rem' }}>
              <input
                type="radio"
                name="weather"
                value={option.value}
                checked={weather === option.value}
                onChange={({ target }) => setWeather(target.value as Weather)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label>Comment:</label>
        <input
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

export default AddDiaryForm;