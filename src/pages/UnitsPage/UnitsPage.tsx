import * as React from 'react';
import s from './UnitsPage.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  unitsDelete,
  unitsLoad,
  unitsUpdate,
} from '../../store/reducers/units/unitsActions';
import EditIcon from '@mui/icons-material/Edit';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal } from '../../components/Modal';
import { ToastContainer, toast } from 'react-toastify';

export const UnitsPage = () => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = React.useState(1);
  const data = useAppSelector((state) => state.unitsReducer.content);
  const [name, setName] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState(0);

  const totalPages = Math.ceil(data.length / 5);
  const paginatedItems = [...data]
    .sort((a, b) => a.id - b.id)
    .slice((currentPage - 1) * 5, currentPage * 5);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleEdit = () => {
    dispatch(unitsUpdate({ id: activeId, title: name }));
    setIsOpen(false);
    setName('');
  };

  const handleDelete = (id: number) => {
    dispatch(unitsDelete({ id: id }));
  };

  React.useEffect(() => {
    dispatch(unitsLoad());
  }, []);

  return (
    <div className={s.root}>
      <h1 className={s.title}>Единицы измерения</h1>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Название</th>
            <th>Редактировать</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>
                <EditIcon
                  sx={{ color: 'white', cursor: 'pointer' }}
                  onClick={() => {
                    setIsOpen(true);
                    setActiveId(item.id);
                  }}
                />
              </td>
              <td>
                <DeleteIcon
                  sx={{ color: 'white', cursor: 'pointer' }}
                  onClick={() => {
                    handleDelete(item.id);
                  }}
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
      <Modal
        buttonText="Обновить"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showUplaod={false}
        onClick={handleEdit}
        classNames={{ modal: s.modal }}
      >
        <h3>Обновление единицы измерения</h3>
        <div className={s.info}>
          <input
            type="text"
            placeholder="Название"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};
