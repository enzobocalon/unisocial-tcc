import { SvgXml } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function NewChat({ size, color }: Props) {
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" width=${size || 16} height=${size || 16} viewBox="0 0 24 24" fill="none" stroke=${color || '#333'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-plus"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`;

  return <SvgXml xml={markup} />;
}
