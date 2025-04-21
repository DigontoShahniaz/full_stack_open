import diagnoses from '../../data/diagonoses';
import { NonSensitiveDignosesEntry, diagnosesEntry } from '../types';

const getEntries = (): diagnosesEntry[] => {
  return diagnoses;
};

const getNonSensitiveEntries = (): NonSensitiveDignosesEntry[] => {
  return diagnoses.map(({ code, name }) => ({
    code,
    name,
  }));
};

export default {
  getEntries,
  getNonSensitiveEntries
};