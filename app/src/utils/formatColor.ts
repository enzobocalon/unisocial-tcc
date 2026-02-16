export function formatColor(color: string): string {
  if (color.startsWith('#')) {
    return color.toUpperCase();
  }

  if (color.includes('rgb')) {
    const rgbValues = color
      .substring(4, color.length - 1)
      .replace(/ /g, '')
      .split(',');

    let hexColor = '#';

    for (let i = 0; i < 3; i++) {
      const hex = parseInt(rgbValues[i]).toString(16);
      hexColor += hex.length == 1 ? '0' + hex : hex;
    }

    return hexColor.toUpperCase();
  }
  return color;
}
