import { combineReducers, configureStore } from '@reduxjs/toolkit';
import metricReducer from './reducers/metric/metricSlice';
import unitsReducer from './reducers/units/unitsSlice';

const rootReducer = combineReducers({
  metricReducer,
  unitsReducer,
});

export const setStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setStore>;
export type AppDispatch = AppStore['dispatch'];
