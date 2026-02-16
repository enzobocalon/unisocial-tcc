import { SvgXml } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function Check({ size, color }: Props) {
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" width=${size || 16} height=${size || 16} fill=${color || '#333'} viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>`;

  return <SvgXml xml={markup} />;
}
