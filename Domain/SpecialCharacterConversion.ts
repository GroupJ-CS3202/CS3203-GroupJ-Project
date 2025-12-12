// Converts potentially dangerous characters to HTML entities
function encodeSpecialCharacters(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
    "!": "&#33;",
    "[": "&#91;",
    "]": "&#93;",
    "$": "&#36;",
  };

  // Notice: [ and ] must be escaped inside the character class
  return str.replace(/[&<>"'!\[\]\$]/g, (m) => map[m]);
}

// Example
const unsafestr = "[this] 'string' i$ very un$&fe";
console.log(encodeSpecialCharacters(unsafestr));
