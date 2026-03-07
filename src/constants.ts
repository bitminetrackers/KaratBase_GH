import { StoneType, StoneShape } from './types';

export const STONE_TYPES: StoneType[] = [
  { name: 'Diamond', density: 3.52 },
  { name: 'Ruby', density: 4.00 },
  { name: 'Sapphire', density: 4.00 },
  { name: 'Emerald', density: 2.72 },
  { name: 'Amethyst', density: 2.65 },
  { name: 'Citrine', density: 2.65 },
  { name: 'Aquamarine', density: 2.68 },
  { name: 'Topaz', density: 3.53 },
  { name: 'Garnet', density: 3.85 },
  { name: 'Tanzanite', density: 3.35 },
  { name: 'Peridot', density: 3.34 },
  { name: 'Tourmaline', density: 3.06 },
  { name: 'Moissanite', density: 3.22 },
  { name: 'Cubic Zirconia', density: 5.80 },
];

export const STONE_SHAPES: StoneShape[] = [
  { name: 'Round', multiplier: 0.0018 },
  { name: 'Oval', multiplier: 0.0020 },
  { name: 'Emerald Cut', multiplier: 0.00245 },
  { name: 'Princess', multiplier: 0.0023 },
  { name: 'Pear', multiplier: 0.00175 },
  { name: 'Marquise', multiplier: 0.0016 },
  { name: 'Heart', multiplier: 0.0021 },
  { name: 'Cushion', multiplier: 0.0022 },
  { name: 'Radiant', multiplier: 0.0023 },
];

export const GOLD_PURITIES = [
  { label: '24K (99.9%)', value: 0.999 },
  { label: '22K (91.6%)', value: 0.916 },
  { label: '18K (75.0%)', value: 0.750 },
  { label: '14K (58.5%)', value: 0.585 },
  { label: '10K (41.7%)', value: 0.417 },
  { label: '9K (37.5%)', value: 0.375 },
];

export const RING_SIZES = Array.from({ length: 27 }, (_, i) => (i / 2 + 1).toString()); // 1 to 14 in 0.5 increments

export const RING_STYLES = [
  { name: 'Half Round', stockFactor: 1.2 },
  { name: 'Flat', stockFactor: 1.0 },
  { name: 'Comfort Fit', stockFactor: 1.3 },
  { name: 'Knife Edge', stockFactor: 1.1 },
];
