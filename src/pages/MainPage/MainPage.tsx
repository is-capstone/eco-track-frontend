import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PublicIcon from '@mui/icons-material/Public';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import MovingIcon from '@mui/icons-material/Moving';

import s from './MainPage.module.scss';
import { Link } from 'react-router-dom';

export const MainPage = () => {
  return (
    <div className={s.root}>
      <div className={s.wrapper}>
        <div className={s.title}>Уменьшите свой углеродный след</div>
        <div className={s.subtitle}>
          EcoTrack - наиболее простой способ отслеживать свой углеродный след.
          Это как фитнес трекер для планеты.
        </div>
      </div>
      <div className={s.info}>
        <div className={s.title}>Как это работает</div>
        <div className={s.subtitle}>
          EcoTrack - наиболее простой способ отслеживать свой углеродный след.
          Это как фитнес трекер для планеты.
        </div>
        <div className={s.grid}>
          <div className={s.panel}>
            <HelpOutlineIcon />
            <div className={s.title}>Что это</div>
            <div className={s.text}>
              Мы проанализируем ваше влияние на окружающую среду и предоставим
              вам отчет.
            </div>
          </div>
          <div className={s.panel}>
            <PublicIcon />
            <div className={s.title}>Отслеживайте</div>
            <div className={s.text}>
              Мы покажем вам, сколько углерода вы выбрасываете в атмосферу по
              разным показателям.
            </div>
          </div>
          <div className={s.panel}>
            <LightbulbOutlinedIcon />
            <div className={s.title}>Персонализированные советы</div>
            <div className={s.text}>
              Мы предложим способы сокращения углеродного следа, основываясь на
              ваших привычках.
            </div>
          </div>
          <div className={s.panel}>
            <MovingIcon />
            <div className={s.title}>Наблюдайте за вашим прогрессом</div>
            <div className={s.text}>
              По мере внесения данных, мы будем пересчитывать ваше влияние,
              чтобы вы могли видеть результат.
            </div>
          </div>
        </div>
      </div>
      <div className={s.bottom}>
        <h1>Готовы начать отслеживать свой углеродный след?</h1>
        <Link to="/stats" className={s.button}>
          Начать
        </Link>
      </div>
    </div>
  );
};
