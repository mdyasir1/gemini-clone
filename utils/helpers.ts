import { Message, RawCountry } from './types';
import { Country } from './types';

export const getFakeAiReply = (message: string): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reply = {
        id: Date.now().toString(),
        content: `I'm a large language model, trained by Google. I'm still learning but can help with many tasks. You said: "${message}"`,
        sender: 'ai' as const,
        timestamp: new Date().toISOString(),
      };
      resolve(reply);
    }, 1500 + Math.random() * 2000);
  });
};

// utils/helpers.ts
export const getCountryData = async () => {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
  const data: RawCountry[] = await response.json();
  return data.map((country) => ({ // Now `country` is typed as `RawCountry`
    name: country.name.common,
    code: country.idd.root + (country.idd.suffixes?.[0] || ''),
    cca2: country.cca2,
  })).sort((a: Country, b: Country) => a.name.localeCompare(b.name));
};

export const customImageLoader = ({ src }: { src: string }) => {
  return src;
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper for image upload
export const getBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};