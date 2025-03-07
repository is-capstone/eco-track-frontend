import * as React from 'react';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import axios from 'axios';
import { keycloak } from '../../main';
import Select, { SingleValue } from 'react-select';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import s from './AdminPage.module.scss';
import { useNavigate } from 'react-router-dom';
import { options } from '../../components/MetricBlock/constant';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const timeOptions = [
  { value: 10, label: '10 минут' },
  { value: 30, label: '30 минут' },
  { value: 60, label: 'Час' },
];

const multiOptions = [
  { value: 1, label: 'x1' },
  { value: 2, label: 'x2' },
  { value: 3, label: 'x3' },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: 120,
    minHeight: 28,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'black',
  }),
  option: (provided) => ({
    ...provided,
    color: 'black',
  }),
};

type OptionType = {
  value: number;
  label: string;
};

interface TimeProps {
  hour: number;
  requests: number;
}

interface FrequentProps {
  endpoint: string;
  requestCount: number;
}

interface SusProps {
  usedBy: string;
  requestCount: number;
  avgRequests: number;
}

export const AdminPage = () => {
  const navigate = useNavigate();
  const isAdmin = keycloak.tokenParsed?.realm_access?.roles.includes('ADMIN');

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/main');
    }
  }, [isAdmin, navigate]);

  const [frequent, serFrequent] = React.useState<FrequentProps[]>([]);
  const [time, setTime] = React.useState<TimeProps[]>([]);
  const [sus, setSus] = React.useState<SusProps>({
    usedBy: 'Нет подозрительных запросов',
    avgRequests: 0,
    requestCount: 0,
  });

  const [selectedOption, setSelectedOption] = React.useState(10);
  const [multi, setMulti] = React.useState(1);

  const [totalPages, setTotalPage] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const labels = time.map((value) => value.hour);
  const requests = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Значение',
        data: time.map((value) => value.requests),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const fetchTime = async () => {
    const response = await axios.get('/api/admin/stats/hour', {
      headers: {
        Authorization: 'Bearer ' + keycloak.token,
      },
    });

    setTime(response.data.data);
  };

  const fetchSus = async () => {
    const response = await axios.get('/api/admin/stats/suspicious/min', {
      headers: {
        Authorization: 'Bearer ' + keycloak.token,
      },
      params: {
        interval: selectedOption,
        multiplier: multi,
      },
    });

    if (response.data.data.length) setSus(response.data.data[0]);
  };

  const fetchData = async () => {
    const response = await axios.get(`/api/admin/stats/frequent`, {
      headers: {
        Authorization: 'Bearer ' + keycloak.token,
      },
      params: {
        top: 3,
      },
    });

    serFrequent(response.data.data);
  };

  const handleSelectTime = (selectedOption: SingleValue<OptionType>) => {
    setSelectedOption(selectedOption?.value ?? 10);
  };

  const handleSelectMulti = (selectedOption: SingleValue<OptionType>) => {
    setMulti(selectedOption?.value ?? 1);
  };

  React.useEffect(() => {
    fetchTime();
    fetchData();
  }, []);

  React.useEffect(() => {
    setTotalPage(Math.ceil(frequent.length / 5));
  }, [frequent]);

  React.useEffect(() => {
    fetchSus();
  }, [selectedOption, multi]);

  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return frequent.slice(startIndex, endIndex);
  }, [frequent, currentPage]);

  return (
    <div className={s.root}>
      <h1 className={s.title}>Админка</h1>
      <div className={s.wrapper}>
        <div className={s.leftWrapper}>
          <div>Количество запросов</div>
          <Line options={options} data={requests} />
        </div>
        <div className={s.rightWrapper}>
          <div>Подозрительные запросы</div>
          <div className={s.selectors}>
            <Select
              onChange={handleSelectTime}
              options={timeOptions}
              styles={customStyles}
            />
            <Select
              onChange={handleSelectMulti}
              options={multiOptions}
              styles={customStyles}
            />
          </div>
          <div>
            <div>{sus.usedBy}</div>
            <div>{`Запросов: ${sus.requestCount}`}</div>
            <div>{`Среднее: ${sus.avgRequests}`}</div>
          </div>
        </div>
      </div>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Количество запросов</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems &&
            paginatedItems.map((item, index) => (
              <tr key={index}>
                <td>{item.endpoint}</td>
                <td>{item.requestCount}</td>
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
