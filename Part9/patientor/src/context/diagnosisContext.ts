import { createContext } from "react";
import { Diagnosis } from "../types";

const DiagnosisContext = createContext<Diagnosis[]>([]);

export default DiagnosisContext;
