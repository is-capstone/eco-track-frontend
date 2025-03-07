import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UnitState, UnitStateList } from './unitsTypes';

const initialState: UnitStateList = {
  content: [],
  isLoading: false,
  error: '',
  totalPages: 0,
};

export const unitsSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    unitsRequest(state) {
      state.isLoading = true;
    },
    unitsSuccess(state, action: PayloadAction<UnitStateList>) {
      state.isLoading = false;
      state.content = action.payload.content;
      state.totalPages = action.payload.totalPages;
    },
    unitsFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default unitsSlice.reducer;
