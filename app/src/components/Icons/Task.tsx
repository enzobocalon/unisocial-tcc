import { SvgXml } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function Task({ size, color }: Props) {
  const markup = `<svg  xmlns="http://www.w3.org/2000/svg"  width="${size || 16}" height="${size || 16}" stroke="${color || '#333'}"  viewBox="0 0 24 24" fill="none" stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /></svg>`;

  return <SvgXml xml={markup} />;
}
