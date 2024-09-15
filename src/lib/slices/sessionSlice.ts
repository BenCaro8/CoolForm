"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Role = 'user' | 'admin';

export type User = {
  id: string;
  username: string;
  role: Role;
}

export type Answer = { question_id: string; answer: string | string[]; };

type State = {
  user?: User;
  questionnaireName: string;
  questionnaireId: string;
  answers: Record<string, any>;
};

const initialState: State = {
  answers: {},
  questionnaireName: 'semagludtide',
  questionnaireId: '1'
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setQuestionnaire: (state, action: PayloadAction<{ name: string; id: string }>) => {
      state.questionnaireName = action.payload.name;
      state.questionnaireId = action.payload.id;
    },
    setAnswer: (state, action: PayloadAction<Answer>) => {
      state.answers[action.payload.question_id] = action.payload.answer;
    },
    setAnswers(state, action: PayloadAction<Answer[]>) {
      const newAnswers = { ...state.answers };
      action.payload.forEach((answer) => {
        newAnswers[answer.question_id] = answer.answer;
      });
      state.answers = newAnswers;
    }
  },
});

export const { setUser, setQuestionnaire, setAnswer, setAnswers } = sessionSlice.actions;

export default sessionSlice.reducer;