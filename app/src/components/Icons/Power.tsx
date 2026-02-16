import { SvgXml } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function Power({ size, color }: Props) {
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" width=${size || 16} height=${size || 16} fill=${color || '#333'}  viewBox="0 0 256 256"><path d="M120,128V48a8,8,0,0,1,16,0v80a8,8,0,0,1-16,0Zm60.37-78.7a8,8,0,0,0-8.74,13.4C194.74,77.77,208,101.57,208,128a80,80,0,0,1-160,0c0-26.43,13.26-50.23,36.37-65.3a8,8,0,0,0-8.74-13.4C47.9,67.38,32,96.06,32,128a96,96,0,0,0,192,0C224,96.06,208.1,67.38,180.37,49.3Z"></path></svg>`;

  return <SvgXml xml={markup} />;
}
