import * as React from 'react';

import s from './StatsPage.module.scss';
import cn from 'classnames';
import { MetricBlock } from '../../components/MetricBlock';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { Modal } from '../../components/Modal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  metricAdd,
  metricEdit,
  metricsLoad,
} from '../../store/reducers/metric/metricActions';
import { Dropdown } from '../../components/Dropdown';

export const StatsPage = () => {
  const dispatch = useAppDispatch();
  const content = useAppSelector((state) => state.metricReducer.content);
  const sortedContent = [...content].sort((a, b) => a.id - b.id);

  const tabs = ['ten', 'thirty', 'all'];

  const [activeTab, setActiveTab] = React.useState<string>(tabs[0]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [units, setUnits] = React.useState(0);
  const [name, setName] = React.useState('');
  const [isEdit, setIsEdit] = React.useState(false);
  const [activeMetric, setActiveMetric] = React.useState(0);

  const handleTab = (tab: number) => {
    if (activeTab === tabs[tab]) return;

    setActiveTab(tabs[tab]);
  };

  const handleEditModal = (id: number) => {
    setIsEdit(true);
    setIsOpen(true);
    setActiveMetric(id);
  };

  const handleAddModal = () => {
    setIsEdit(false);
    setIsOpen(true);
  };

  const handleChangeUnits = (selectedOption: number) => {
    setUnits(selectedOption);
  };

  const handleAdd = () => {
    dispatch(metricAdd({ title: name, unitsId: units }));
    setTimeout(() => {
      dispatch(metricsLoad(0));
      setIsOpen(false);
    }, 1500);
  };

  const handleEdit = () => {
    dispatch(metricEdit({ id: activeMetric, title: name, unitsId: units }));
    setTimeout(() => {
      dispatch(metricsLoad(0));
      setIsOpen(false);
      setIsEdit(false);
    }, 1500);
  };

  React.useEffect(() => {
    dispatch(metricsLoad(0));
  }, []);

  return (
    <div className={s.root}>
      <div className={s.wrapper}>
        <div className={s.title}>Статистика</div>
        <div className={s.subtitle}>
          <span>Показатели</span>
          <Link to="/units" className={s.tab}>
            Единицы измерения
          </Link>
          <Link to="/history" className={s.tab}>
            История
          </Link>
        </div>
        <div className={s.times}>
          <div
            className={cn(s.tab, { [s.active]: activeTab === 'ten' })}
            onClick={() => handleTab(0)}
          >
            10 записей
          </div>
          <div
            className={cn(s.tab, { [s.active]: activeTab === 'thirty' })}
            onClick={() => handleTab(1)}
          >
            30 записей
          </div>
          <div
            className={cn(s.tab, { [s.active]: activeTab === 'all' })}
            onClick={() => handleTab(2)}
          >
            Все
          </div>
        </div>
        <div className={s.stroke}></div>
        <div className={s.table}>
          {sortedContent.map((value) => (
            <MetricBlock
              title={value.title}
              key={value.id}
              id={value.id}
              onEdit={handleEditModal}
              unit={value.units.title}
              type={activeTab}
            />
          ))}
          <div className={s.add} onClick={handleAddModal}>
            <div>Нажмите, чтобы добавить метрику</div>
            <AddIcon sx={{ fontSize: 140 }} />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setIsEdit(false);
        }}
        showUplaod={false}
        onClick={isEdit ? handleEdit : handleAdd}
      >
        <h1>{isEdit ? 'Обновление' : 'Добавление'} метрики</h1>
        <div className={s.info}>
          <div className={s.value}>
            <input
              type="text"
              placeholder="Название"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Dropdown onChange={handleChangeUnits} />
          </div>
        </div>
      </Modal>
    </div>
  );
};
