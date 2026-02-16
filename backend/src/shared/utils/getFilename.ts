export function getFilename(originalName: string) {
  return `${new Date().getTime()}-${originalName.trim().replaceAll(' ', '-')}`;
}
