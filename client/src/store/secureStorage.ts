export const saveItemToSecureStore = async (key: string, value: string) => {
    localStorage.setItem(key, value);
};

export const getItemFromSecureStore = async (key: string): Promise<string | null> => {
    return localStorage.getItem(key);
};

export const deleteItemFromSecureStore = async (key: string) => {
    localStorage.removeItem(key);
};
