import axios from "axios";
import { apiBaseUrl } from '../constants'; 
import { Diaries, AddDataType } from '../types';

const getAll = async () => {
  const { data } = await axios.get<Diaries[]>(
    `${apiBaseUrl}/diaries`
  );
  return data;
};

const create = async (object: AddDataType) => {
  const { data } = await axios.post<Diaries>(
    `${apiBaseUrl}/diaries`, object
  );

  return data;
};

export default {
  getAll, create
}
