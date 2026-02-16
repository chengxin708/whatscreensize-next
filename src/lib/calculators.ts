import type { TVResult, MonitorResult, MonitorSpec } from '@/types/calculator';

const AVAILABLE_TV_SIZES = [42, 48, 55, 65, 75, 77, 83, 85, 98, 100, 115];

export function calculateTVSize(distanceMeters: number): TVResult {
  const distanceInches = distanceMeters * 39.3701;
  const goodDiagonal = (distanceInches * 0.5) / 0.8717;
  const bestDiagonal = (distanceInches * 0.6) / 0.8717;

  const goodSize = AVAILABLE_TV_SIZES.reduce((prev, curr) =>
    Math.abs(curr - goodDiagonal) < Math.abs(prev - goodDiagonal) ? curr : prev
  );

  const bestSize = AVAILABLE_TV_SIZES.reduce((prev, curr) =>
    Math.abs(curr - bestDiagonal) < Math.abs(prev - bestDiagonal) ? curr : prev
  );

  return { best: bestSize, good: goodSize };
}

const monitorDatabase: Record<string, MonitorSpec[]> = {
  standard: [
    { size: 24, res: 'FHD', resolution: '1920 x 1080', ppi: 92, notes: 'Esports-focused; 360-540Hz options, cramped for productivity.', tags: ['gaming'] },
    { size: 24, res: 'QHD', resolution: '2560 x 1440', ppi: 123, notes: 'Niche high-PPI for tight desks; sharp, limited models.', tags: ['gaming', 'productivity'] },
    { size: 27, res: 'FHD', resolution: '1920 x 1080', ppi: 81, notes: 'Looks grainy in 2025; avoid unless on a tight budget.', tags: ['gaming'] },
    { size: 27, res: 'QHD', resolution: '2560 x 1440', ppi: 109, notes: 'Sweet spot; lots of OLED/IPS options for gaming and work.', tags: ['gaming', 'productivity'] },
    { size: 27, res: '4K', resolution: '3840 x 2160', ppi: 163, notes: 'Very sharp text; modern high-refresh panels suit AAA and work.', tags: ['gaming', 'productivity'] },
    { size: 27, res: '5K', resolution: '5120 x 2880', ppi: 218, notes: 'Mac/creative favorite; Retina sharpness, typically 60Hz.', tags: ['productivity'] },
    { size: 32, res: 'QHD', resolution: '2560 x 1440', ppi: 93, notes: 'Lower PPI; can look coarse up close, fine if you like large text.', tags: ['gaming', 'productivity'] },
    { size: 32, res: '4K', resolution: '3840 x 2160', ppi: 140, notes: '2025 standout; OLED/mini-LED high refresh and well-rounded.', tags: ['gaming', 'productivity'] },
    { size: 32, res: '8K', resolution: '7680 x 4320', ppi: 275, notes: 'Ultra niche; expensive and demanding, mainly professional use.', tags: ['productivity'] },
    { size: 43, res: '4K', resolution: '3840 x 2160', ppi: 104, notes: 'TV-like immersion; great for consoles/multitask, check office clarity on some OLEDs.', tags: ['gaming', 'productivity'] },
    { size: 48, res: '4K', resolution: '3840 x 2160', ppi: 92, notes: 'Needs 80cm+ desk depth to avoid strain; unmatched immersion for controller gaming.', tags: ['gaming', 'productivity'] },
  ],
  ultrawide: [
    { size: 30, res: 'WFHD', resolution: '2560 x 1080', ppi: 96, notes: 'Stretched 1080p; limited vertical space, mainly entry immersion/sim racing.', tags: ['gaming'] },
    { size: 34, res: 'WQHD', resolution: '3440 x 1440', ppi: 110, notes: 'Mainstream ultrawide; like dual 27" QHD; OLED variants excel for gaming.', tags: ['gaming', 'productivity'] },
    { size: 38, res: 'WQHD+', resolution: '3840 x 1600', ppi: 110, notes: 'More vertical room than 34"; fewer models but balanced experience.', tags: ['gaming', 'productivity'] },
    { size: 45, res: 'WQHD', resolution: '3440 x 1440', ppi: 84, notes: 'Low PPI; text looks coarse; best only for immersive games/movies.', tags: ['gaming'] },
    { size: 45, res: '5K2K', resolution: '5120 x 2160', ppi: 123, notes: 'High-PPI, high-refresh 2025 panels that fix the old 45" softness.', tags: ['gaming', 'productivity'] },
  ],
  superwide: [
    { size: 49, res: 'DFHD', resolution: '3840 x 1080', ppi: 81, notes: 'Two 27" 1080p panels side-by-side; very pixelated, not recommended.', tags: ['gaming'] },
    { size: 49, res: 'DQHD', resolution: '5120 x 1440', ppi: 109, notes: 'Dual QHD feel; great productivity; OLED for gaming, Mini-LED for burn-in safe office work.', tags: ['gaming', 'productivity'] },
    { size: 57, res: 'DUHD', resolution: '7680 x 2160', ppi: 140, notes: 'Dual 4K-class workspace; stellar clarity, needs a GPU with DP 2.1.', tags: ['gaming', 'productivity'] },
  ],
};

export function calculateMonitorSpecs(distanceCm: number): MonitorResult {
  const idealPPI = Math.round(8732 / distanceCm);
  const comfortThreshold = idealPPI * 0.85;

  const processCategory = (monitors: MonitorSpec[]) => {
    return monitors.map((monitor) => {
      const ppiDiff = Math.abs(monitor.ppi - idealPPI);
      const isRetina = monitor.ppi >= idealPPI;
      const isComfortable = monitor.ppi >= comfortThreshold;
      const isAcceptable = isRetina || isComfortable;

      return {
        ...monitor,
        ppiDiff,
        isAcceptable,
        isBest: isRetina,
        displayName: `${monitor.size}" ${monitor.res} (${monitor.resolution})`,
      };
    });
  };

  return {
    idealPPI,
    categories: {
      standard: {
        name: { en: 'Standard Wide (16:9)', zh: '标准宽屏 (16:9)' },
        monitors: processCategory(monitorDatabase.standard).sort((a, b) => b.ppi - a.ppi),
      },
      ultrawide: {
        name: { en: 'Ultrawide (21:9)', zh: '带鱼屏 (21:9)' },
        monitors: processCategory(monitorDatabase.ultrawide).sort((a, b) => b.ppi - a.ppi),
      },
      superwide: {
        name: { en: 'Super Ultrawide (32:9)', zh: '超级带鱼屏 (32:9)' },
        monitors: processCategory(monitorDatabase.superwide).sort((a, b) => b.ppi - a.ppi),
      },
    },
  };
}

export { AVAILABLE_TV_SIZES };
