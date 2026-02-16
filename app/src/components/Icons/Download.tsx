import { SvgXml } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function Download({ size, color }: Props) {
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" width=${size || 16} height=${size || 16} fill=${color || '#333'} viewBox="0 0 256 256"><path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"></path></svg>`;

  return <SvgXml xml={markup} />;
}
