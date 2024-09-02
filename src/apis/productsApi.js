import axios from 'axios';

const apiProducts = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {},
});

export const selectProductData = async (data) => {
    let reqUrl;
    if (data) {
        reqUrl = `/api/selectProducts/${data}`;
    } else {
        reqUrl = '/api/selectProducts';
    }
    try {
        const response = await apiProducts.get(reqUrl);
        return response.data; // 응답 데이터를 반환하여 호출한 곳에서 사용할 수 있게 함
    } catch (error) {
        console.error('Error fetching wholesale product data:', error);
        throw error; // 에러를 다시 던져서 호출한 곳에서 에러 처리할 수 있게 함
    }
};

export const selectWorkingSearchWord = async (data, page = 1, limit = 50) => {
    let reqUrl = `/api/getWorkingData?page=${page}&limit=${limit}`;
    if (data) {
        reqUrl += `&search=${data}`;
    }

    try {
        const response = await apiProducts.get(reqUrl);
        return response.data; // 응답 데이터를 반환하여 호출한 곳에서 사용할 수 있게 함
    } catch (error) {
        console.error('Error fetching wholesale product data:', error);
        throw error; // 에러를 다시 던져서 호출한 곳에서 에러 처리할 수 있게 함
    }
};

export const putWorkingData = async (data) => {
    const reqUrl = '/api/putWorkingData';
    try {
        const response = await apiProducts.put(reqUrl, data);
    } catch (error) {
        console.error('Error put putWorkingData : ', error);
    }
};

export const wholeSaleProductData = async (data) => {
    let reqUrl;
    if (data) {
        reqUrl = `/api/products/${data}`;
    } else {
        reqUrl = '/api/products';
    }
    try {
        const response = await apiProducts.get(reqUrl);
        return response.data; // 응답 데이터를 반환하여 호출한 곳에서 사용할 수 있게 함
    } catch (error) {
        console.error('Error fetching wholesale product data:', error);
        throw error; // 에러를 다시 던져서 호출한 곳에서 에러 처리할 수 있게 함
    }
};

export const searchWordData = async (data) => {
    const reqUrl = `/api/searchWord/${data}`;
    try {
        const response = await apiProducts.get(reqUrl);
        return response.data[0].searchWord;
    } catch (error) {
        console.log('Error fetching searchWordData : '.error);
    }
};

export const putSearchWord = async (data) => {
    console.log(data);
    const reqUrl = '/api/putSearchWord';
    try {
        const response = await apiProducts.put(reqUrl, data);
        return response.data;
    } catch (error) {
        console.error('Error put searchWord : ', error);
    }
};
