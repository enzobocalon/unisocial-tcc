import ContentLoader, { Rect } from 'react-content-loader/native';

interface Props {
  borderRadius?: number;
}

export function Skeleton({ borderRadius }: Props) {
  return (
    <ContentLoader width={'100%'} height={'100%'} foregroundColor="#ffffff">
      <Rect
        x="0"
        y="0"
        rx={borderRadius || 0}
        ry={borderRadius || 0}
        width={'100%'}
        height={'100%'}
      />
    </ContentLoader>
  );
}
