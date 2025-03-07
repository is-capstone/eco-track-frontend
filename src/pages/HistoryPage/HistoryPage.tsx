import * as React from 'react';

import s from './HistoryPage.module.scss';

import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import axios from 'axios';
import { keycloak } from '../../main';

interface HistoryProps {
  name: string;
  ownedBy: string;
  status: string;
}

export const HistoryPage = () => {
  const [data, setData] = React.useState<HistoryProps[]>([]);

  const [totalPages, setTotalPage] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const fetchData = async () => {
    const response = await axios.get(`/api/file/history`, {
      headers: {
        Authorization: 'Bearer ' + keycloak.token,
      },
      params: {
        size: 50,
      },
    });

    setData(response.data.content);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    if (data) {
      setTotalPage(Math.ceil(data.length / 5));
    }
  }, [data]);

  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  return (
    <div className={s.root}>
      <h1 className={s.title}>История импорта</h1>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Название</th>
            <th>Владелец</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems &&
            paginatedItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.ownedBy}</td>
                <td>{item.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className={s.pagination}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          <WestIcon sx={{ color: 'white' }} />
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          <EastIcon sx={{ color: 'white' }} />
        </button>
      </div>
    </div>
  );
};
