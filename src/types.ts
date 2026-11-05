export type CanThemeId = 
  | 'apple' 
  | 'tomatoes' 
  | 'tuna' 
  | 'peaches' 
  | 'strawberry' 
  | 'coffee' 
  | 'midnight' 
  | 'sardines';

export type FontStyle = 'typewriter' | 'handwriting' | 'serif';

export type StampId = 'none' | 'fish' | 'airmail' | 'wax_heart' | 'botanical' | 'star';

export type SoundSourceType = 'none' | 'ambient' | 'upload' | 'youtube' | 'voice';

export type AmbientSoundId = 
  | 'none'
  | 'ocean_waves'
  | 'gentle_rain'
  | 'warm_vinyl'
  | 'cozy_cafe'
  | 'summer_crickets'
  | 'music_box';

export interface CanPhoto {
  id: string;
  url: string;
  caption?: string;
}

export interface CanData {
  id: string;
  themeId: CanThemeId;
  title: string; // The text printed on the front of the can (max 16 chars)
  to?: string;
  from: string; // Your name
  message: string;
  fontStyle: FontStyle;
  stampId: StampId;
  photoUrl: string; // Data URL or preset image URL (first photo or fallback)
  photoCaption?: string;
  photos?: CanPhoto[]; // Up to 10 photos
  
  // Audio configuration
  soundSource: SoundSourceType;
  soundId?: AmbientSoundId;
  soundDataUrl?: string; // For uploaded MP3 or recorded voice note (base64 audio)
  soundTitle?: string;
  youtubeUrl?: string;
  youtubeId?: string;

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
  emoji: string;
  description: string;
}
