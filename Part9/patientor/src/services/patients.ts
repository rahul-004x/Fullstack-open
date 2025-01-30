import axios from "axios";
import { EntryWithoutId, Patient, PatientFormValues, Entry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const createEntry = async (id: string, object: EntryWithoutId) => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${id}/entries`, object
  );

  return data;
};

const findById = async (id: string) => {
  const { data } = await axios.get<Patient>(
    `${apiBaseUrl}/patients/${id}`
  );
  return data;
};

export default {
  getAll, create, createEntry, findById
};

