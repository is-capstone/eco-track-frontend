import axios from 'axios';
import { AppDispatch } from '../../store';
import { metricSlice } from './metricSlice';
import { keycloak } from '../../../main';

export const metricsLoad = (page: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(metricSlice.actions.metricRequest());

    const response = await axios.get('/api/metrics/metrics-info', {
      headers: {
        Authorization: 'Bearer ' + keycloak.token,
      },
      params: {
        page: page,
      },
    });

    dispatch(metricSlice.actions.metricSuccess(response.data));
  } catch (e) {
    dispatch(metricSlice.actions.metricFailure(e.message()));
  }
};

export const metricAdd =
  (metric: { title: string; unitsId: number }) =>
  async (dispath: AppDispatch) => {
    try {
      await axios.post(
        '/api/metrics/metrics-info/create',
        {
          title: metric.title,
          unitsId: metric.unitsId,
        },
        {
          headers: {
            Authorization: 'Bearer ' + keycloak.token,
          },
        }
      );
    } catch (e) {
      dispath(metricSlice.actions.metricFailure(e.message()));
    }
  };

export const metricDelete = (id: number) => async (dispatch: AppDispatch) => {
  try {
    axios.delete(`/api/metrics/metrics-info/${id}/delete`, {
      headers: {
        Authorization: 'Bearer ' + keycloak.token,
      },
    });
    setTimeout(() => dispatch(metricsLoad(0)), 1000);
  } catch (e) {
    dispatch(metricSlice.actions.metricFailure(e.message()));
  }
};

export const metricEdit =
  (metric: { id: number; title: string; unitsId: number }) =>
  async (dispatch: AppDispatch) => {
    try {
      axios.put(
        `/api/metrics/metrics-info/${metric.id}/update`,
        {
          title: metric.title,
          unitsId: metric.unitsId,
        },
        {
          headers: {
            Authorization: 'Bearer ' + keycloak.token,
          },
        }
      );
    } catch (e) {
      dispatch(metricSlice.actions.metricFailure(e.message()));
    }
  };
