export type CanThemeId = 'apple' | 'tomatoes' | 'tuna';

export type FontStyle = 'typewriter' | 'handwriting' | 'serif';

export type StampId = 'none' | 'fish' | 'airmail' | 'wax_heart' | 'botanical' | 'star';

export type AmbientSoundId = 
  | 'none'
  | 'ocean_waves'
  | 'gentle_rain'
  | 'warm_vinyl'
  | 'cozy_cafe'
  | 'summer_crickets'
  | 'music_box'
  | 'custom_voice';

export interface CanData {
  id: string;
  themeId: CanThemeId;
  title: string; // The text printed on the front of the can (e.g. "for you", max 16 chars)
  to?: string;
  from: string; // Your name
  message: string;
  fontStyle: FontStyle;
  stampId: StampId;
  photoUrl: string; // Data URL or preset image URL
  photoCaption?: string;
  soundId: AmbientSoundId;
  soundDataUrl?: string; // For recorded voice note (base64 audio)
  soundTitle?: string;
  createdAt: number;
  shelfLifeDays: number;
  location?: string;
}

export interface CanThemeConfig {
  id: CanThemeId;
  name: string;
  labelColor: string;
  stripeColor: string;
  textColor: string;
  tagline: string;
  description: string;
}
