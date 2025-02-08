// Generates a user color based on the user's name or ID.
export default function generateUserColor(user) {
  // Create a unique string by concatenating the user's name or ID.
  const userIdentifier = user.id || user.name;

  // Convert the unique string to a hash using a simple hash function (FNV-1a Hash).
  let hash = 0;
  for (let i = 0; i < userIdentifier.length; i++) {
    hash = (hash << 5) - hash + userIdentifier.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer.
  }

  // Convert the hash value to a color code by creating a color in RGB format.
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;

  // Normalize the RGB values and return a color in #RRGGBB format.
  return `#${((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}
