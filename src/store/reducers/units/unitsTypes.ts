export interface UnitState {
  id: number;
  title: string;
}

export interface UnitStateList {
  isLoading: boolean;
  error: string;
  content: UnitState[];
  totalPages: number;
}
