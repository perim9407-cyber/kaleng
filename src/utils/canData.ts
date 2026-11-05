import { CanData, CanThemeConfig, CanThemeId, SoundSourceType } from '../types';

export const CAN_THEMES: Record<CanThemeId, CanThemeConfig> = {
  apple: {
    id: 'apple',
    name: 'Apple / For You',
    labelColor: '#178F56',
    stripeColor: '#F5BA42',
    textColor: '#14532D',
    tagline: 'Sweet Honeycrisp Apple',
    emoji: '🍏',
    description: 'Classic emerald green can with red fruit and warm gold banner.',
  },
  tomatoes: {
    id: 'tomatoes',
    name: 'Tomatoes Can',
    labelColor: '#D99B26',
    stripeColor: '#DC2626',
    textColor: '#78350F',
    tagline: 'San Marzano Ripe Tomatoes',
    emoji: '🍅',
    description: 'Golden yellow harvest can with three juicy red tomatoes.',
  },
  tuna: {
    id: 'tuna',
    name: 'Tuna Can',
    labelColor: '#6B7E96',
    stripeColor: '#F5BA42',
    textColor: '#1E293B',
    tagline: 'Ocean White Tuna',
    emoji: '🐟',
    description: 'Silver-blue can with retro tuna fish illustration and yellow stripe.',
  },
  peaches: {
    id: 'peaches',
    name: 'Sweet Peaches',
    labelColor: '#F97316',
    stripeColor: '#FEF08A',
    textColor: '#7C2D12',
    tagline: 'Golden Peaches in Syrup',
    emoji: '🍑',
    description: 'Warm apricot coral can with sliced sun-ripened orchard peaches.',
  },
  strawberry: {
    id: 'strawberry',
    name: 'Wild Strawberry',
    labelColor: '#E11D48',
    stripeColor: '#FEE2E2',
    textColor: '#881337',
    tagline: 'Sweet Berry Garden',
    emoji: '🍓',
    description: 'Cozy berry pink can with ripe red strawberries and blooming petals.',
  },
  coffee: {
    id: 'coffee',
    name: 'Morning Coffee',
    labelColor: '#78350F',
    stripeColor: '#F59E0B',
    textColor: '#451A03',
    tagline: 'Roastery Espresso Hum',
    emoji: '☕',
    description: 'Warm mocha brown can with cozy porcelain mug and heart latte art.',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Star',
    labelColor: '#312E81',
    stripeColor: '#FDE047',
    textColor: '#1E1B4B',
    tagline: 'Starlit Nocturne',
    emoji: '🌙',
    description: 'Deep navy-indigo can with golden crescent moon and twinkling stars.',
  },
  sardines: {
    id: 'sardines',
    name: 'Lisbon Sardines',
    labelColor: '#1E3A8A',
    stripeColor: '#D97706',
    textColor: '#172554',
    tagline: 'Marinhas Lusitanas',
    emoji: '🥫',
    description: 'Vintage royal navy tin with two silver sardines and olive branch.',
  },
};

export const PRESET_PHOTOS = [
  {
    id: 'cafe_polaroid',
    url: '/src/assets/images/polaroid_memory_cafe_1793894881798.jpg',
    label: 'Sunny Cafe & Coffee',
  },
  {
    id: 'ocean_sunset',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    fallbackEmoji: '🌊',
    label: 'Seaside Sunset',
  },
  {
    id: 'rainy_window',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    fallbackEmoji: '🌧️',
    label: 'Rain on Glass',
  },
  {
    id: 'vinyl_record',
    url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80',
    fallbackEmoji: '📻',
    label: 'Vintage Turntable',
  },
  {
    id: 'wildflowers',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
    fallbackEmoji: '🌼',
    label: 'Wild Daisies',
  },
];

export const AMBIENT_SOUND_OPTIONS = [
  { id: 'ocean_waves', name: 'Ocean Waves & Tide', icon: 'Waves', desc: 'Rhythmic sea surf and gentle coastal air' },
  { id: 'gentle_rain', name: 'Rain on Windowpane', icon: 'CloudRain', desc: 'Calming summer shower droplets' },
  { id: 'cozy_cafe', name: 'Quiet Corner Cafe', icon: 'Coffee', desc: 'Soft warmth, espresso hum & distant spoons' },
  { id: 'warm_vinyl', name: 'Vintage Vinyl Crackle', icon: 'Disc', desc: 'Warm 33rpm analog needle dust' },
  { id: 'music_box', name: 'Antique Music Box', icon: 'Music', desc: 'Lullaby chime melody from a brass key' },
  { id: 'summer_crickets', name: 'Midnight Crickets', icon: 'Moon', desc: 'Serene summer twilight breeze' },
];

export const STAMP_OPTIONS = [
  { id: 'none', label: 'No Stamp' },
  { id: 'fish', label: 'Silver Fish Stamp' },
  { id: 'airmail', label: 'Par Avion Air Mail' },
  { id: 'wax_heart', label: 'Crimson Wax Seal' },
  { id: 'botanical', label: 'Botanical Leaf' },
  { id: 'star', label: 'Golden Star' },
];

/**
 * Extract YouTube Video ID from any YouTube URL (watch, shorts, youtu.be, embed)
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();
  
  // youtu.be/ID
  const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/watch?v=ID or youtube.com/embed/ID or youtube.com/shorts/ID
  const standardMatch = cleanUrl.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (standardMatch) return standardMatch[1];

  // Bare 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) return cleanUrl;

  return null;
}

export const DEFAULT_CAN_DATA: CanData = {
  id: 'cl-sample-01',
  themeId: 'apple',
  title: 'for you',
  to: 'Someone Dear',
  from: 'Your Friend',
  message: `I made this canned letter for you.

Whenever you open this, I hope it brings a quiet smile to your face. Keep this safe on your shelf!`,
  fontStyle: 'handwriting',
  stampId: 'wax_heart',
  photoUrl: '/src/assets/images/polaroid_memory_cafe_1793894881798.jpg',
  photoCaption: 'A quiet morning just for you.',
  soundSource: 'ambient',
  soundId: 'cozy_cafe',
  soundTitle: 'Quiet Corner Cafe',
  createdAt: Date.now(),
  shelfLifeDays: 10,
  location: 'Air Sealed · Today',
};

/**
 * Encode CanData into a compact URL-safe hash
 */
export function encodeCanToHash(can: CanData): string {
  try {
    const compactPhotos = (can.photos || []).map((p) => ({
      i: p.id,
      u: p.url.startsWith('data:') && p.url.length > 5000 ? '' : p.url,
      c: p.caption || '',
    }));

    const compactObj = {
      i: can.id,
      t: can.themeId,
      ttl: can.title || 'for you',
      to: can.to || '',
      f: can.from,
      m: can.message,
      fn: can.fontStyle,
      s: can.stampId,
      p: can.photoUrl.startsWith('data:') && can.photoUrl.length > 5000 ? '' : can.photoUrl,
      pc: can.photoCaption || '',
      pts: compactPhotos,
      ss: can.soundSource,
      snd: can.soundId || 'none',
      st: can.soundTitle || '',
      yu: can.youtubeUrl || '',
      yi: can.youtubeId || '',
      c: can.createdAt,
      sl: can.shelfLifeDays,
      l: can.location || '',
    };
    const json = JSON.stringify(compactObj);
    const base64 = btoa(encodeURIComponent(json));
    return base64;
  } catch (e) {
    console.error('Failed to encode can', e);
    return '';
  }
}

/**
 * Decode CanData from a URL hash
 */
export function decodeCanFromHash(hashStr: string): CanData | null {
  try {
    if (!hashStr) return null;
    const clean = hashStr.replace(/^#\/?can=/, '').replace(/^#/, '');
    if (!clean) return null;

    const json = decodeURIComponent(atob(clean));
    const obj = JSON.parse(json);

    const themeId: CanThemeId = CAN_THEMES[obj.t as CanThemeId] ? (obj.t as CanThemeId) : 'apple';

    // If previously saved in pantry locally, recover full rich data including high-res local photos
    const pantryCans = getPantryCans();
    const existingInPantry = pantryCans.find((c) => c.id === obj.i);

    const decodedPhotos = (obj.pts || []).map((p: { i: string; u: string; c: string }) => ({
      id: p.i,
      url: p.u || obj.p || '',
      caption: p.c || '',
    }));

    return {
      id: obj.i || `can-${Date.now()}`,
      themeId,
      title: obj.ttl || 'for you',
      to: obj.to || '',
      from: obj.f || '',
      message: obj.m || '',
      fontStyle: obj.fn || 'handwriting',
      stampId: obj.s || 'wax_heart',
      photoUrl: existingInPantry?.photoUrl || obj.p || (decodedPhotos[0]?.url || ''),
      photoCaption: obj.pc || existingInPantry?.photoCaption || '',
      photos: existingInPantry?.photos || (decodedPhotos.length > 0 ? decodedPhotos : undefined),
      soundSource: (obj.ss as SoundSourceType) || (obj.yi ? 'youtube' : obj.snd !== 'none' ? 'ambient' : 'none'),
      soundId: obj.snd || 'none',
      soundTitle: obj.st || '',
      youtubeUrl: obj.yu || '',
      youtubeId: obj.yi || '',
      soundDataUrl: existingInPantry?.soundDataUrl,
      createdAt: obj.c || Date.now(),
      shelfLifeDays: obj.sl || 10,
      location: obj.l || '',
    };
  } catch (e) {
    console.error('Failed to decode can from hash', e);
    return null;
  }
}

/**
 * Pantry local storage helpers
 */
const PANTRY_STORAGE_KEY = 'canned_letter_pantry_v3';

export function getPantryCans(): CanData[] {
  try {
    const raw = localStorage.getItem(PANTRY_STORAGE_KEY);
    if (!raw) return [DEFAULT_CAN_DATA];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_CAN_DATA];
  } catch {
    return [DEFAULT_CAN_DATA];
  }
}

export function saveCanToPantry(can: CanData): void {
  try {
    const cans = getPantryCans().filter(c => c.id !== can.id);
    cans.unshift(can);
    localStorage.setItem(PANTRY_STORAGE_KEY, JSON.stringify(cans.slice(0, 30)));
  } catch (e) {
    console.error('Failed to save to pantry', e);
  }
}

export function deleteCanFromPantry(id: string): void {
  try {
    const cans = getPantryCans().filter(c => c.id !== id);
    localStorage.setItem(PANTRY_STORAGE_KEY, JSON.stringify(cans));
  } catch (e) {
    console.error('Failed to delete can', e);
  }
}

/**
 * Calculate shelf life status and badge
 */
export function getShelfLifeStatus(createdAt: number, shelfLifeDays: number = 10) {
  const ageMs = Date.now() - createdAt;
  const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));

  if (ageDays <= 0) {
    return {
      statusText: 'Day 0 · Freshly Sealed',
      level: 'fresh',
    };
  } else if (ageDays <= 3) {
    return {
      statusText: `Day ${ageDays} · Best By`,
      level: 'good',
    };
  } else if (ageDays <= shelfLifeDays) {
    return {
      statusText: `Day ${ageDays} · Preserved`,
      level: 'aging',
    };
  } else {
    return {
      statusText: 'Vintage Heirloom',
      level: 'heirloom',
    };
  }
}
