import * as React from 'react';

import s from './ValuesPage.module.scss';
import { useParams } from 'react-router-dom';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from 'axios';
import { keycloak } from '../../main';

interface ValueProps {
  id: number;
  value: number;
  relevantOn: string;
}

export const ValuesPage = () => {
  const { id } = useParams<{ id: string }>();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [data, setData] = React.useState<ValueProps[]>([]);

  const [totalPages, setTotalPage] = React.useState(1);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const timeFormatter = (value: ValueProps) => {
    const date = new Date(value.relevantOn);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const time = date.toLocaleString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Moscow',
    });

    return `${day}.${month}|${time}`;
  };

  const fetchData = async () => {
    const response = await axios.get(`/api/metrics/metrics-values/${id}/all`, {
      headers: {
        Authorization: 'Bearer ' + keycloak.token,
      },
      params: {
        size: 500,
      },
    });

    const content = response.data.content.sort((a, b) => {
      return (
        new Date(a.relevantOn).getTime() - new Date(b.relevantOn).getTime()
      );
    });

    const formattedTimes = content.map((item) => {
      return {
        ...item,
        relevantOn: timeFormatter(item),
      };
    });

    setData(formattedTimes);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/metrics/metrics-values/${id}/delete`, {
      headers: {
        Authorization: 'Bearer ' + keycloak.token,
      },
    });
    setTimeout(() => {
      fetchData();
    }, 1000);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    setTotalPage(Math.ceil(data.length / 10));
  }, [data]);

  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  return (
    <div className={s.root}>
      <h1 className={s.title}>Значения</h1>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Значение</th>
            <th>Время</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems &&
            paginatedItems.map((item, index) => (
              <tr key={index}>
                <td>{item.value}</td>
                <td>{item.relevantOn}</td>
                <td>
                  <DeleteIcon
                    sx={{ color: 'white', cursor: 'pointer' }}
                    onClick={() => handleDelete(item.id)}
                  />
                </td>
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
