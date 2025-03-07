import { UnitState } from '../units/unitsTypes';

export interface MetricState {
  id: number;
  title: string;
  units: UnitState;
}

export interface MetricStateList {
  isLoading: boolean;
  error: string;
  content: MetricState[];
  totalPage: number;
  totalElements: number;
  pageable?: { pageNumber: number };
}
