import * as React from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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

import s from './MetricBlock.module.scss';
import { options } from './constant';
import { Modal } from '../Modal';
import { useAppDispatch } from '../../hooks/redux';
import { metricDelete } from '../../store/reducers/metric/metricActions';
import axios from 'axios';
import { keycloak } from '../../main';
import { useNavigate } from 'react-router-dom';

export interface dataProps {
  labels: string[];
  datasets: {
    fill: boolean;
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

interface MetricBlockProps {
  title: string;
  id: number;
  onEdit: (id: number) => void;
  unit?: string;
  type: string;
}

export const MetricBlock = ({
  title,
  id,
  onEdit,
  unit,
  type,
}: MetricBlockProps) => {
  const dispatch = useAppDispatch();
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [date, setDate] = React.useState('');
  const [values, serValues] = React.useState([]);
  const [labels, serLabels] = React.useState([]);
  const [newValue, setNewValue] = React.useState(0);

  const router = useNavigate();

  const modifiedOptions = React.useMemo(() => {
    return {
      ...options,
      scales: {
        ...options.scales,
        y: {
          ...options.scales?.y,
          title: {
            display: true,
            text: unit,
          },
        },
      },
    };
  }, [unit]);

  const fetchData = async () => {
    console.log(type);
    const page = type === 'ten' ? 10 : type === 'thirty' ? 30 : 500;
    const response = await axios.get(`/api/metrics/metrics-values/${id}/all`, {
      headers: {
        Authorization: 'Bearer ' + keycloak.token,
      },
      params: {
        page: 0,
        size: page,
      },
    });

    const content = response.data.content.sort((a, b) => {
      return (
        new Date(a.relevantOn).getTime() - new Date(b.relevantOn).getTime()
      );
    });

    const formattedTimes = content.map((item) => {
      const date = new Date(item.relevantOn);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const time = date.toLocaleString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Moscow',
      });

      return `${day}.${month}|${time}`;
    });

    serLabels(formattedTimes);
    serValues(content.map((item) => item.value));
  };

  const handleAdd = async () => {
    const newDate = new Date(date);

    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');

    const fullDate = new Date(
      `${newDate.toISOString().split('T')[0]}T${hours}:${minutes}:00`
    );
    await axios.post(
      `/api/metrics/metrics-values/${id}/create`,
      {
        value: newValue,
        relevantOn: fullDate.toISOString(),
      },
      {
        headers: {
          Authorization: 'Bearer ' + keycloak.token,
        },
      }
    );
    setTimeout(() => {
      fetchData();
      setIsOpenModal(false);
    }, 1000);
  };

  React.useEffect(() => {
    fetchData();
  }, [type]);

  const exampleData = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Значение',
        data: values,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const handleDelete = () => {
    dispatch(metricDelete(id));
  };

  React.useEffect(() => {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    setDate(`${year}-${month}-${day}`);
  }, []);

  return (
    <div className={s.root}>
      <div className={s.wrapper}>
        <div className={s.title}>
          <div>{title}</div>
          <div>
            <EditIcon
              sx={{ color: 'white', cursor: 'pointer' }}
              onClick={() => onEdit(id)}
            />
            <DeleteIcon
              sx={{ color: 'white', cursor: 'pointer' }}
              onClick={() => handleDelete()}
            />
          </div>
        </div>
        <div className={s.text} onClick={() => setIsOpenModal(true)}>
          Нажмите, чтобы добавить данные
        </div>
        <div className={s.graph}>
          <Line
            options={modifiedOptions}
            data={exampleData}
            onClick={() => router(`/stats/${id}`)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
      <Modal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onClick={handleAdd}
        metricId={id}
      >
        <h1>Добавление данных</h1>
        <div className={s.info}>
          <div className={s.value}>
            <input
              type="number"
              placeholder="Значение"
              value={newValue}
              onChange={(event) => setNewValue(parseFloat(event.target.value))}
            />
            <span>{unit}</span>
          </div>
          <div className={s.date}>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <span> </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
