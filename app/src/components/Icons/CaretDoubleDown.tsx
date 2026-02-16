import { SvgXml } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function CaretDoubleDown({ size, color }: Props) {
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" width=${size || 16} height=${size || 16} fill=${color || '#333'} viewBox="0 0 256 256"><path d="M213.66,130.34a8,8,0,0,1,0,11.32l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,204.69l74.34-74.35A8,8,0,0,1,213.66,130.34Zm-91.32,11.32a8,8,0,0,0,11.32,0l80-80a8,8,0,0,0-11.32-11.32L128,124.69,53.66,50.34A8,8,0,0,0,42.34,61.66Z"></path></svg>`;

  return <SvgXml xml={markup} />;
}
