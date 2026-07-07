import ky from 'ky';

export const api = ky.create({
  prefix: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  parseJson: (text) => {
    const { status, message, data } = JSON.parse(text);
    if (Array.isArray(data)) {
      data.status = status;
      data.message = message;
      return data;
    }
    return { ...data, status, message };
  }
});
