// Color system from original design
export const COLORS = {
  gold: '#f5a623',
  goldLight: '#ffc857',
  goldDim: 'rgba(245, 166, 35, 0.3)',

  bgNight: '#05060f',
  bgDay: 'hsl(210, 65%, 62%)',
  bgDusk: '#382050',
  bgDawn: '#2c1244',

  surface: 'rgba(255, 255, 255, 0.06)',
  surface2: 'rgba(255, 255, 255, 0.07)',

  text: '#e8e0d0',
  textDim: 'rgba(232, 224, 208, 0.5)',

  border: 'rgba(245, 166, 35, 0.15)',

  radius: '16px',
};

// Sky keyframes for different times of day
export const SKY_KEYFRAMES = [
  { hour: 0, bg: '#05060f' },   // midnight
  { hour: 4, bg: '#0a0c1a' },   // pre-dawn
  { hour: 5, bg: '#2c1244' },   // dawn
  { hour: 6, bg: '#382050' },   // early morning
  { hour: 7, bg: '#4a3f6f' },   // sunrise
  { hour: 8, bg: '#5b6fa8' },   // morning blue
  { hour: 10, bg: 'hsl(210, 65%, 62%)' }, // day
  { hour: 16, bg: 'hsl(210, 60%, 58%)' }, // late afternoon
  { hour: 17, bg: '#8b6fa3' },  // golden hour
  { hour: 18, bg: '#7a4d7e' },  // dusk
  { hour: 19, bg: '#4a2f5c' },  // twilight
  { hour: 20, bg: '#1f1333' },  // evening
  { hour: 21, bg: '#0f0820' },  // night
  { hour: 24, bg: '#05060f' },  // midnight again
];

export default COLORS;
