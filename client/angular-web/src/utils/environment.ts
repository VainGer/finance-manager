export function getEnv(prod: boolean) {
  if (prod) {
    return '';
  }
  return 'http://localhost:5500/api';
}
