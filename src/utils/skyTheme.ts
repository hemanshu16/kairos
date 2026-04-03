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
  // Midnight
  { time: 0, outer: [5, 6, 18], inner: [18, 10, 45], stars: 1.0, rx: 30, ry: 20 },
  { time: 4, outer: [5, 6, 18], inner: [18, 10, 45], stars: 1.0, rx: 30, ry: 20 },

  // Pre-dawn (4h–5h30) — very dark, faint blue-purple hint
  { time: 4.5, outer: [8, 9, 28], inner: [22, 14, 55], stars: 0.95, rx: 28, ry: 18 },
  { time: 5, outer: [12, 12, 38], inner: [28, 18, 62], stars: 0.88, rx: 25, ry: 82 },

  // First light (5h30) — indigo horizon glows faintly
  { time: 5.5, outer: [20, 18, 55], inner: [65, 38, 70], stars: 0.72, rx: 22, ry: 85 },

  // Dawn / Sunrise (6h–7h) — warm pinks & golds climb slowly
  { time: 6, outer: [42, 28, 68], inner: [180, 90, 60], stars: 0.5, rx: 18, ry: 88 },
  { time: 6.5, outer: [55, 40, 80], inner: [215, 120, 70], stars: 0.3, rx: 15, ry: 90 },
  { time: 7, outer: [70, 55, 90], inner: [230, 145, 80], stars: 0.15, rx: 12, ry: 88 },

  // Golden hour morning (7h30–9h) — soft warm sky opening up
  { time: 7.5, outer: [65, 95, 145], inner: [200, 165, 100], stars: 0.06, rx: 40, ry: 20 },
  { time: 9, outer: [70, 120, 185], inner: [140, 190, 230], stars: 0.03, rx: 55, ry: 15 },

  // Full daytime (10h–16h) — beautiful natural sky cerulean
  { time: 10, outer: [72, 130, 195], inner: [115, 185, 240], stars: 0.0, rx: 60, ry: 10 },
  { time: 14, outer: [68, 128, 192], inner: [108, 180, 238], stars: 0.0, rx: 65, ry: 8 },
  { time: 16, outer: [70, 125, 188], inner: [112, 178, 235], stars: 0.0, rx: 65, ry: 10 },

  // Late afternoon / golden dusk (17h–18h30) — warm gold-amber
  { time: 17, outer: [90, 90, 140], inner: [210, 148, 88], stars: 0.05, rx: 70, ry: 60 },
  { time: 18, outer: [55, 38, 80], inner: [195, 100, 55], stars: 0.25, rx: 60, ry: 75 },

  // Twilight / dusk (18h30–20h) — purples & magentas settle in
  { time: 18.5, outer: [32, 20, 55], inner: [120, 55, 65], stars: 0.55, rx: 50, ry: 80 },
  { time: 19.5, outer: [16, 12, 40], inner: [44, 22, 62], stars: 0.78, rx: 40, ry: 50 },

  // Night (20h–22h) — deep blue-indigo, stars emerge
  { time: 21, outer: [8, 8, 25], inner: [22, 12, 50], stars: 0.95, rx: 32, ry: 22 },
  { time: 22, outer: [5, 6, 18], inner: [18, 10, 45], stars: 1.0, rx: 30, ry: 20 },
  { time: 24, outer: [5, 6, 18], inner: [18, 10, 45], stars: 1.0, rx: 30, ry: 20 }
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

  return {
    outer: `rgb(${outer[0]}, ${outer[1]}, ${outer[2]})`,
    inner: `rgb(${inner[0]}, ${inner[1]}, ${inner[2]})`,
    stars: lerp(k1.stars, k2.stars, t),
    rx: lerp(k1.rx, k2.rx, t),
    ry: lerp(k1.ry, k2.ry, t)
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
}

// Get time as decimal
export function getTimeDecimal(date: Date = new Date()): number {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  return hours + (minutes / 60) + (seconds / 3600) + (milliseconds / 3600000);
}

