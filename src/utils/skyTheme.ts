// Sky theme keyframes - 26 time-of-day gradient transitions
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
  { time: 0, outer: [5, 6, 15], inner: [12, 8, 25], stars: 1, rx: 50, ry: 50 },
  // 1 AM
  { time: 1, outer: [5, 6, 16], inner: [13, 9, 26], stars: 1, rx: 50, ry: 50 },
  // 2 AM
  { time: 2, outer: [6, 7, 17], inner: [14, 10, 27], stars: 1, rx: 50, ry: 50 },
  // 3 AM
  { time: 3, outer: [7, 8, 18], inner: [15, 11, 28], stars: 1, rx: 50, ry: 50 },
  // 4 AM - Pre-dawn
  { time: 4, outer: [15, 12, 30], inner: [25, 18, 40], stars: 0.9, rx: 50, ry: 50 },
  // 5 AM - Dawn begins
  { time: 5, outer: [44, 18, 68], inner: [70, 35, 90], stars: 0.6, rx: 50, ry: 75 },
  // 6 AM - Sunrise
  { time: 6, outer: [135, 94, 156], inner: [255, 159, 95], stars: 0.3, rx: 50, ry: 85 },
  // 7 AM - Morning
  { time: 7, outer: [255, 179, 130], inner: [255, 200, 150], stars: 0.1, rx: 50, ry: 90 },
  // 8 AM
  { time: 8, outer: [100, 149, 237], inner: [135, 206, 250], stars: 0, rx: 50, ry: 95 },
  // 9 AM - Mid-morning
  { time: 9, outer: [87, 138, 230], inner: [120, 190, 255], stars: 0, rx: 50, ry: 100 },
  // 10 AM
  { time: 10, outer: [80, 130, 220], inner: [110, 180, 255], stars: 0, rx: 50, ry: 100 },
  // 11 AM
  { time: 11, outer: [75, 125, 215], inner: [100, 170, 250], stars: 0, rx: 50, ry: 100 },
  // 12 PM - Noon
  { time: 12, outer: [70, 120, 210], inner: [90, 160, 245], stars: 0, rx: 50, ry: 100 },
  // 1 PM
  { time: 13, outer: [75, 125, 215], inner: [100, 170, 250], stars: 0, rx: 50, ry: 100 },
  // 2 PM
  { time: 14, outer: [80, 130, 220], inner: [110, 180, 255], stars: 0, rx: 50, ry: 95 },
  // 3 PM
  { time: 15, outer: [87, 138, 230], inner: [120, 190, 255], stars: 0, rx: 50, ry: 90 },
  // 4 PM - Late afternoon
  { time: 16, outer: [95, 145, 235], inner: [130, 195, 255], stars: 0, rx: 50, ry: 85 },
  // 5 PM - Golden hour
  { time: 17, outer: [255, 179, 130], inner: [255, 140, 80], stars: 0.1, rx: 50, ry: 75 },
  // 6 PM - Sunset
  { time: 18, outer: [255, 120, 70], inner: [180, 60, 100], stars: 0.3, rx: 50, ry: 65 },
  // 7 PM - Dusk
  { time: 19, outer: [120, 70, 150], inner: [80, 40, 100], stars: 0.6, rx: 50, ry: 55 },
  // 8 PM - Evening
  { time: 20, outer: [56, 32, 80], inner: [35, 20, 60], stars: 0.8, rx: 50, ry: 50 },
  // 9 PM
  { time: 21, outer: [25, 18, 45], inner: [15, 10, 30], stars: 0.9, rx: 50, ry: 50 },
  // 10 PM
  { time: 22, outer: [15, 12, 30], inner: [10, 8, 20], stars: 0.95, rx: 50, ry: 50 },
  // 11 PM
  { time: 23, outer: [8, 7, 18], inner: [6, 5, 12], stars: 1, rx: 50, ry: 50 },
  // Back to midnight (for smooth looping)
  { time: 24, outer: [5, 6, 15], inner: [12, 8, 25], stars: 1, rx: 50, ry: 50 }
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
  // Find the two keyframes to interpolate between
  let k1 = themeKeyframes[0];
  let k2 = themeKeyframes[1];

  for (let i = 0; i < themeKeyframes.length - 1; i++) {
    if (timeFloat >= themeKeyframes[i].time && timeFloat <= themeKeyframes[i + 1].time) {
      k1 = themeKeyframes[i];
      k2 = themeKeyframes[i + 1];
      break;
    }
  }

  // Calculate interpolation factor
  const t = (timeFloat - k1.time) / (k2.time - k1.time);

  // Interpolate colors
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
  if (customBg) {
    // If custom background is set, use it instead
    document.body.style.background = customBg;
  } else {
    // Apply radial gradient
    document.body.style.background = `radial-gradient(ellipse ${theme.rx}% ${theme.ry}% at 50% 50%, ${theme.inner}, ${theme.outer})`;
  }
}

// Get time as decimal (e.g., 14.5 for 2:30 PM)
export function getTimeDecimal(date: Date = new Date()): number {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  return hours + (minutes / 60) + (seconds / 3600) + (milliseconds / 3600000);
}

// Custom background presets
export const themePresets: Record<string, string | null> = {
  dynamic: null, // Use dynamic sky
  dark: '#05060f',
  forest: 'linear-gradient(135deg, #1a4d2e 0%, #0f2922 100%)',
  ocean: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)',
  space: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  minimal: '#0a0a0a'
};
