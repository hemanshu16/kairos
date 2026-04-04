// Sky theme configuration based on the provided HTML's natural sky color keyframes
export interface SkyThemeConfig {
  time: number;
  outer: number[];
  inner: number[];
  stars: number;
  rx: number;
  ry: number;
}

export const themeKeyframes: SkyThemeConfig[] = [
  // Midnight — Entirely Dark
  { time: 0, outer: [2, 2, 4], inner: [4, 4, 8], stars: 1.0, rx: 30, ry: 20 },
  { time: 4, outer: [2, 2, 4], inner: [4, 4, 8], stars: 1.0, rx: 30, ry: 20 },

  // Pre-dawn (5h) — deep indigo transitioning to first light
  { time: 5, outer: [12, 10, 35], inner: [35, 25, 75], stars: 0.9, rx: 20, ry: 80 },

  // Sunrise (6.5h) — Golden yellow horizon, warm glow
  { time: 6.5, outer: [100, 80, 40], inner: [255, 220, 130], stars: 0.4, rx: 10, ry: 90 },

  // Morning (10h) — Increasing yellow warmth, sun getting stronger
  { time: 10, outer: [80, 155, 235], inner: [255, 235, 150], stars: 0.0, rx: 40, ry: 25 },

  // Midday (12h) — Peak "Sun Glare", white-yellow sky wash
  { time: 12, outer: [140, 190, 245], inner: [255, 255, 235], stars: 0.0, rx: 50, ry: 12 },

  // Peak Heat (14h) — Still washed out with brilliant white light
  { time: 14, outer: [145, 195, 245], inner: [255, 255, 238], stars: 0.0, rx: 60, ry: 15 },

  // Afternoon Transition (16h) — Sun descending, yellow fading into gold-blue
  { time: 16, outer: [60, 120, 210], inner: [255, 200, 80], stars: 0.0, rx: 75, ry: 30 },

  // Golden Hour (18h) — Warm amber begins
  { time: 18, outer: [80, 40, 15], inner: [255, 160, 50], stars: 0.0, rx: 85, ry: 80 },

  // Sunset Start (18.5h / 6:30 PM) — Vibrant orange
  { time: 18.5, outer: [60, 20, 10], inner: [255, 120, 30], stars: 0.0, rx: 90, ry: 90 },

  // Peak Sunset (19h / 7:00 PM) — Rich deep red-orange
  { time: 19, outer: [40, 8, 12], inner: [220, 60, 15], stars: 0.0, rx: 88, ry: 95 },

  // Sunset End (19.25h / 7:15 PM) — Nearly dark, deep plum, NO stars yet
  { time: 19.25, outer: [15, 8, 25], inner: [50, 15, 45], stars: 0.0, rx: 70, ry: 60 },

  // Dark Gap (19.75h / 7:45 PM) — Dark blue
  { time: 19.75, outer: [6, 8, 22], inner: [12, 18, 45], stars: 0.0, rx: 40, ry: 30 },

  // Moon Rise (20h / 8:00 PM) — Stars begin appearing with moon, sky remains dark blue
  { time: 20, outer: [6, 8, 22], inner: [12, 18, 45], stars: 0.1, rx: 35, ry: 25 },

  // Stars gradually intensify (20.5h / 8:30 PM) — Still dark blue
  { time: 20.5, outer: [6, 8, 22], inner: [12, 18, 45], stars: 0.3, rx: 33, ry: 23 },

  // 9:00 PM — Still dark blue, begins losing color to turn pitch black
  { time: 21, outer: [6, 8, 22], inner: [12, 18, 45], stars: 0.6, rx: 31, ry: 21 },

  // 10:00 PM — Entirely dark background
  { time: 22, outer: [2, 2, 4], inner: [4, 4, 8], stars: 1.0, rx: 30, ry: 20 },
  
  // Midnight
  { time: 24, outer: [2, 2, 4], inner: [4, 4, 8], stars: 1.0, rx: 30, ry: 20 }
];

// Linear interpolation helper
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Interpolate RGB color arrays
function lerpColor(color1: number[], color2: number[], t: number): number[] {
  return [
    Math.round(lerp(color1[0], color2[0], t)),
    Math.round(lerp(color1[1], color2[1], t)),
    Math.round(lerp(color1[2], color2[2], t))
  ];
}

export interface AppliedTheme {
  outer: string;
  inner: string;
  stars: number;
  rx: number;
  ry: number;
  textColor: string;
  textDimColor: string;
}

// Get theme for a specific time (0-24 hours as decimal)
export function getTheme(timeFloat: number): AppliedTheme {
  let k1 = themeKeyframes[0];
  let k2 = themeKeyframes[themeKeyframes.length - 1];

  for (let i = 0; i < themeKeyframes.length - 1; i++) {
    if (timeFloat >= themeKeyframes[i].time && timeFloat <= themeKeyframes[i + 1].time) {
      k1 = themeKeyframes[i];
      k2 = themeKeyframes[i + 1];
      break;
    }
  }

  const range = k2.time - k1.time;
  const t = range === 0 ? 0 : (timeFloat - k1.time) / range;

  const outer = lerpColor(k1.outer, k2.outer, t);
  const inner = lerpColor(k1.inner, k2.inner, t);

  // Dynamic text color: Deep Slate during day (6am-6pm), White/Cream at night
  const isDay = timeFloat >= 6 && timeFloat < 18;
  const textColor = isDay ? 'rgba(15, 23, 42, 0.9)' : '#e8e0d0';
  const textDimColor = isDay ? 'rgba(15, 23, 42, 0.5)' : 'rgba(232, 224, 208, 0.5)';

  return {
    outer: `rgb(${outer[0]}, ${outer[1]}, ${outer[2]})`,
    inner: `rgb(${inner[0]}, ${inner[1]}, ${inner[2]})`,
    stars: lerp(k1.stars, k2.stars, t),
    rx: lerp(k1.rx, k2.rx, t),
    ry: lerp(k1.ry, k2.ry, t),
    textColor,
    textDimColor
  };
}

// Apply theme to document body
export function applyTheme(theme: AppliedTheme, customBg: string | null = null): void {
  const body = document.body;
  
  if (customBg) {
    if (customBg.startsWith('preset:')) {
      const presets: Record<string, string> = {
        'preset:dark': 'linear-gradient(135deg, #0a0b10, #141622)',
        'preset:forest': 'linear-gradient(135deg, #0b1a13, #153322)',
        'preset:ocean': 'linear-gradient(135deg, #0a1727, #11344a)',
        'preset:space': 'radial-gradient(circle at 50% 50%, #151025, #05040a)',
        'preset:minimal': '#11131a'
      };
      body.style.background = presets[customBg] || presets['preset:minimal'];
    } else {
      body.style.background = `radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 8, 0.7) 100%), url('${customBg}') center/cover no-repeat`;
    }
    body.classList.add('custom-bg-active');
  } else {
    // Apply dynamic radial gradient matching HTML's formula
    body.style.background = `radial-gradient(ellipse at ${Math.round(theme.rx)}% ${Math.round(theme.ry)}%, ${theme.inner} 0%, ${theme.outer} 70%)`;
    body.classList.remove('custom-bg-active');
  }

  // Set dynamic text colors globally
  body.style.setProperty('--text', theme.textColor);
  body.style.setProperty('--text-dim', theme.textDimColor);
}

// Get time as decimal
export function getTimeDecimal(date: Date = new Date()): number {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  return hours + (minutes / 60) + (seconds / 3600) + (milliseconds / 3600000);
}

