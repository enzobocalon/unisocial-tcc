export function textSlicer(text: string, limit?: number) {
  if (!limit) limit = 2000000;
  const slicedText = text.slice(0, limit);
  return `${slicedText}${text.length > limit ? '...' : ''}`;
}
