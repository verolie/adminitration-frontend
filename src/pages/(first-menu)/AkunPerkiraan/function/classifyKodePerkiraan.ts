export const classifyKodePerkiraan = (kode: string): string => {
  const level = kode.split(".").length;
  if (level === 3) {
    return "detail";
  } else if (level === 2) {
    return "sub";     
  } else if (level === 1) {
    return "induk";   
  }
  return "unknown"; 
};