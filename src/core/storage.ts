import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY || 'yes99-secret-key-123';

/**
 * SecureStorage: Wrapper ສໍາລັບ localStorage ທີ່ມີການ Encrypt ຂໍ້ມູນ
 * ເໝາະສໍາລັບເກັບຄ່າ Configuration ທີ່ບໍ່ຢາກໃຫ້ User ທົ່ວໄປແກ້ໄຂງ່າຍໆ
 */
export const SecureStorage = {
  setItem: (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      const encryptedValue = CryptoJS.AES.encrypt(jsonValue, SECRET_KEY).toString();
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Error saving to secure storage:', error);
    }
  },

  getItem: <T>(key: string): T | null => {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;

      const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData) as T;
    } catch (error) {
      console.error('Error reading from secure storage:', error);
      return null;
    }
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  },
};
