/**
 * Trims a string,
 * removes any loose markdown,
 * and ensures it starts with a capital.
 * @param string
 */
function cleanString(string: string) {
  return string
    ?.trim()
    .replace(/\*{1,2}/gi, '')
    .replace(/^(.)/, (_, l) => l.toUpperCase());
}

export default cleanString;
