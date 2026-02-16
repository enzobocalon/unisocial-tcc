export function checkMediaFormat(input: string) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', '3gp', 'mkv'];

  // Extrai extensão mesmo que input seja uma URL
  const extension = input.split('.').pop()?.toLowerCase() ?? '';

  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  return 'unsupported';
}
