import { putProductCategory } from '../apis/productsApi.js';

export const useProductCategory = () => {
    const updateProductCategory = async (data) => {
        try {
            const response = await putProductCategory(data);
            return response;
        } catch (error) {
            console.error('Error updating product category:', error);
            throw error;
        }
    };

    return {
        putProductCategory: updateProductCategory,
    };
};
