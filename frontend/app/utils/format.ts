export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 MB';
  const k = 1024;
  const dm = 2;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}; 