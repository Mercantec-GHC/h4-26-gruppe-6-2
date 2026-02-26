export type AppItem = {
  id: string;
  name: string;
  keywords: string[];
  icon: any; // image source
};

export const APPS: AppItem[] = [
  {
    id: 'tiktok',
    name: 'TikTok',
    keywords: ['tiktok', 'tik tok'],
    icon: require('../assets/appIcons/tiktok.png'),
  },
  {
    id: 'youtube',
    name: 'YouTube',
    keywords: ['youtube', 'yt'],
    icon: require('../assets/appIcons/youtube.png'),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    keywords: ['instagram', 'insta'],
    icon: require('../assets/appIcons/instagram.png'),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    keywords: ['facebook', 'fb'],
    icon: require('../assets/appIcons/facebook.png'),
  },
  /* skal add flere apps senere
  {
    id: 'snapchat',
    name: 'Snapchat',
    keywords: ['snap', 'snapchat'],
    icon: require('../assets/appIcons/snapchat.png'),
  },
  {
    id: 'netflix',
    name: 'Netflix',
    keywords: ['netflix'],
    icon: require('../assets/appIcons/netflix.png'),
  },
  {
    id: 'spotify',
    name: 'Spotify',
    keywords: ['spotify', 'music'],
    icon: require('../assets/appIcons/spotify.png'),
  },
  */
];
