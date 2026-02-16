export function getFileExtension(filePath: string) {
  // Use a regular expression to extract the extension
  const match = filePath.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
  return match ? match[1] : null;
}
