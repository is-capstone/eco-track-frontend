import axios from 'axios';
import { AppDispatch } from '../../store';
import { keycloak } from '../../../main';
import { unitsSlice } from './unitsSlice';
import { toast } from 'react-toastify';

export const unitAdd =
  (unit: { title: string }) => async (dispath: AppDispatch) => {
    try {
      await axios.post(
        '/api/metrics/metrics-units/create',
        {
          title: unit.title,
        },
        {
          headers: {
            Authorization: 'Bearer ' + keycloak.token,
          },
        }
      );
    } catch (e) {
      dispath(unitsSlice.actions.unitsFailure(e.message()));
    }
  };

export const unitsLoad = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(unitsSlice.actions.unitsRequest());

    const response = await axios.get('/api/metrics/metrics-units', {
      headers: {
        Authorization: 'Bearer ' + keycloak.token,
      },
    });

    dispatch(unitsSlice.actions.unitsSuccess(response.data));
  } catch (e) {
    dispatch(unitsSlice.actions.unitsFailure(e.message()));
  }
};

export const unitsUpdate =
  (unit: { id: number; title: string }) => async (dispatch: AppDispatch) => {
    try {
      await axios.put(
        `/api/metrics/metrics-units/${unit.id}/update`,
        {
          title: unit.title,
        },
        {
          headers: {
            Authorization: 'Bearer ' + keycloak.token,
          },
        }
      );
      setTimeout(() => {
        dispatch(unitsLoad());
      }, 1000);
    } catch (e) {
      dispatch(unitsSlice.actions.unitsFailure(e.message()));
    }
  };

export const unitsDelete =
  (unit: { id: number }) => async (dispatch: AppDispatch) => {
    try {
      await axios.delete(`/api/metrics/metrics-units/${unit.id}/delete`, {
        headers: {
          Authorization: 'Bearer ' + keycloak.token,
        },
      });
      setTimeout(() => {
        dispatch(unitsLoad());
      }, 1000);
    } catch (error) {
      toast.error(error.response.data.messages[0]);
    }
  };
