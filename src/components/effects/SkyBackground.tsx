import React, { useEffect, useState } from 'react';
import Starfield from './Starfield';
import SunMoonOrb from './SunMoonOrb';
import Clouds from './Clouds';
import { getTheme, applyTheme, getTimeDecimal } from '../../utils/skyTheme';
import { getZonedTime } from '../../utils/timeUtils';
import { useApp } from '../../contexts/AppContext';

const SkyBackground: React.FC = () => {
  const { timezone, customBg } = useApp();
  const [timeFloat, setTimeFloat] = useState(() => getTimeDecimal(getZonedTime(timezone)));

  useEffect(() => {
    const updateTheme = () => {
      const currentZonedTime = getZonedTime(timezone);
      const newTimeFloat = getTimeDecimal(currentZonedTime);
      setTimeFloat(newTimeFloat);
      
      const theme = getTheme(newTimeFloat);
      applyTheme(theme, customBg);
    };

    updateTheme();
    const interval = setInterval(updateTheme, 1000);
    return () => clearInterval(interval);
  }, [timezone, customBg]);

  return (
    <>
      <Starfield timeFloat={timeFloat} />
      <Clouds timeFloat={timeFloat} />
      <SunMoonOrb timeFloat={timeFloat} />
    </>
  );
};

export default React.memo(SkyBackground);
