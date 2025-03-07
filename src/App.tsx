import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/MainPage/MainPage';
import { Header } from './components/Header';
import { AdminPage } from './pages/AdminPage';
import { StatsPage } from './pages/StatsPage';
import { HistoryPage } from './pages/HistoryPage';
import { UnitsPage } from './pages/UnitsPage';
import { ValuesPage } from './pages/ValuesPage';

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/stats/:id" element={<ValuesPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/units" element={<UnitsPage />} />
        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
