import { CanData, CanThemeConfig, CanThemeId } from '../types';

export const CAN_THEMES: Record<CanThemeId, CanThemeConfig> = {
  tuna: {
    id: 'tuna',
    name: 'Tuna Can',
    labelColor: '#6B7E96',
    stripeColor: '#F5BA42',
    textColor: '#1E293B',
    tagline: 'Ocean White Tuna',
    description: 'Silver-blue can with retro tuna fish illustration and yellow stripe.',
  },
  tomatoes: {
    id: 'tomatoes',
    name: 'Tomatoes Can',
    labelColor: '#D99B26',
    stripeColor: '#DC2626',
    textColor: '#78350F',
    tagline: 'San Marzano Ripe Tomatoes',
    description: 'Golden yellow harvest can with three juicy red tomatoes.',
  },
  apple: {
    id: 'apple',
    name: 'Apple / For You',
    labelColor: '#178F56',
    stripeColor: '#F5BA42',
    textColor: '#14532D',
    tagline: 'Sweet Honeycrisp Apple',
    description: 'Classic emerald green can with red fruit and warm gold banner.',
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
  { id: 'custom_voice', name: 'Microphone Voice Note', icon: 'Mic', desc: 'Record 10 seconds of your voice or environment' },
  { id: 'none', name: 'Silent / No Audio', icon: 'VolumeX', desc: 'Just words and the photo' },
];

export const STAMP_OPTIONS = [
  { id: 'none', label: 'No Stamp' },
  { id: 'fish', label: 'Silver Fish Stamp' },
  { id: 'airmail', label: 'Par Avion Air Mail' },
  { id: 'wax_heart', label: 'Crimson Wax Seal' },
  { id: 'botanical', label: 'Botanical Leaf' },
  { id: 'star', label: 'Golden Star' },
];

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
    const compactObj = {
      i: can.id,
      t: can.themeId,
      ttl: can.title || 'for you',
      to: can.to || '',
      f: can.from,
      m: can.message,
      fn: can.fontStyle,
      s: can.stampId,
      p: can.photoUrl.startsWith('data:') ? '' : can.photoUrl,
      pc: can.photoCaption || '',
      snd: can.soundId,
      st: can.soundTitle || '',
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

    return {
      id: obj.i || `can-${Date.now()}`,
      themeId: obj.t === 'tuna' || obj.t === 'tomatoes' ? obj.t : 'apple',
      title: obj.ttl || 'for you',
      to: obj.to || '',
      from: obj.f || '',
      message: obj.m || '',
      fontStyle: obj.fn || 'handwriting',
      stampId: obj.s || 'wax_heart',
      photoUrl: obj.p || '/src/assets/images/polaroid_memory_cafe_1793894881798.jpg',
      photoCaption: obj.pc || '',
      soundId: obj.snd || 'cozy_cafe',
      soundTitle: obj.st || '',
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
const PANTRY_STORAGE_KEY = 'canned_letter_pantry_v2';

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
