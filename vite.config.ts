import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Mevcut çalışma dizinindeki env değişkenlerini yükle
  // 3. parametre '' olduğu için önek (VITE_) kontrolü yapmadan tümünü yükler
  // Bu sayede process.env.API_KEY erişimi Vercel üzerinde sorunsuz çalışır
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // process.env nesnesini güvenli bir şekilde oluşturuyoruz
      // Sadece ihtiyacımız olan API_KEY'i içeri alıyoruz
      'process.env': {
        API_KEY: env.API_KEY
      }
    }
  };
});