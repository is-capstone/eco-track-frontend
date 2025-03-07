import { Link } from 'react-router-dom';
import s from './Header.module.scss';
import { keycloak } from '../../main';

export const Header = () => {
  const isAdmin = keycloak.tokenParsed?.realm_access?.roles.includes('ADMIN');

  return (
    <div className={s.root}>
      <div className={s.leftWrapper}>
        <div className={s.logo}>
          <div className={s.circle}></div>
          <div className={s.circle}></div>
          <div className={s.circle}></div>
        </div>
        EcoTrack
      </div>
      <div className={s.rightWrapper}>
        <Link to="/main" className={s.tab}>
          Главная
        </Link>
        <Link to="/stats" className={s.tab}>
          Статистика
        </Link>
        {isAdmin && (
          <Link to="/admin" className={s.tab}>
            Админ
          </Link>
        )}
        <div className={s.enter} onClick={() => keycloak.logout()}>
          Выйти
        </div>
      </div>
    </div>
  );
};
