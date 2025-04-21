import axios from 'axios';
import { Diaries, NewDiary } from "./types";

const baseUrl = 'http://localhost:3000/api/diaries'

export const getAllDiaries = () => {
  return axios
    .get<Diaries[]>(baseUrl)
    .then(response => response.data)
}

export const createDiary = (object: NewDiary) => {
  return axios
    .post<Diaries>(baseUrl, object)
    .then(response => response.data)
}