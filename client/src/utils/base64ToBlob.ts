export const base64ToBlob = (base64String: string) => {
  const binary = atob(base64String); // Decode Base64 to binary string
  const byteArray = Uint8Array.from(binary, (char) => char.charCodeAt(0)); // Convert directly to Uint8Array
  return new Blob([byteArray], { type: "application/pdf" }); // Create Blob
};
