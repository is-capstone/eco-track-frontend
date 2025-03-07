import * as React from 'react';
import Select, { components, SingleValue } from 'react-select';
import { Modal } from '../Modal';

import s from './Dropdown.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { unitAdd, unitsLoad } from '../../store/reducers/units/unitsActions';

interface DropdownProps {
  onChange?: (value: number) => void;
}

type OptionType = {
  value: number;
  label: string;
};

export const Dropdown = ({ onChange }: DropdownProps) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.unitsReducer.content);

  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const [hasReachedBottom, setHasReachedBottom] = React.useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleAdd = () => {
    dispatch(unitAdd({ title: value }));
    setIsOpen(false);
    setTimeout(() => dispatch(unitsLoad()), 2000);
  };

  const handleChangeValue = (selectedOption: SingleValue<OptionType>) => {
    if (onChange && selectedOption) {
      onChange(selectedOption?.value ?? '');
    }
  };

  React.useEffect(() => {
    dispatch(unitsLoad());
  }, []);

  const CustomMenuList = (props: any) => {
    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;

      const isAtBottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 5;

      if (isAtBottom && !hasReachedBottom) {
        // console.log('Достигнут конец списка');
        // setHasReachedBottom(true);
      }
    };

    return (
      <components.MenuList {...props}>
        <div
          onScroll={handleScroll}
          style={{ maxHeight: 200, overflowY: 'auto' }}
        >
          <div
            style={{
              padding: '10px',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#f0f0f0',
            }}
            onClick={() => setIsOpen(true)}
          >
            ➕ Добавить
          </div>
          {props.children}
        </div>
      </components.MenuList>
    );
  };

  return (
    <>
      <Select
        options={data.map((item) => ({
          value: item.id,
          label: item.title,
        }))}
        components={{ MenuList: CustomMenuList }}
        menuPortalTarget={document.body}
        styles={{
          menuList: (base) => ({
            ...base,
            maxHeight: 100,
          }),
        }}
        onChange={handleChangeValue}
      />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        classNames={{ modal: s.modal, wrapper: s.wrapper }}
        showUplaod={false}
        onClick={handleAdd}
      >
        <h2>Добавить ед. измерения</h2>
        <div className={s.value}>
          <input
            type="text"
            placeholder="Название"
            value={value}
            onChange={handleChange}
          />
        </div>
      </Modal>
    </>
  );
};
