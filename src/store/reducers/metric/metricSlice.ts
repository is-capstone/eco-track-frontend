import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MetricStateList } from './metricTypes';

const initialState: MetricStateList = {
  content: [],
  isLoading: false,
  error: '',
  totalPage: 0,
  totalElements: 0,
};

export const metricSlice = createSlice({
  name: 'metric',
  initialState,
  reducers: {
    metricRequest(state) {
      state.isLoading = true;
    },
    metricSuccess(state, action: PayloadAction<MetricStateList>) {
      state.isLoading = false;
      state.content = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.totalPage = action.payload.totalPage;
    },
    metricFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default metricSlice.reducer;
