import axios from 'axios';

const apiProducts = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {},
});

// 작업 상품 선택 데이터 조회
export const selectProductData = async (data, page = 1, limit = 50) => {
    let reqUrl = `/api/selectProducts?page=${page}&limit=${limit}`;
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

// 작업 상품 선택 데이터 저장
export const putWorkingData = async (data) => {
    const reqUrl = '/api/putWorkingData';
    try {
        const response = await apiProducts.put(reqUrl, data);
        return response;
    } catch (error) {
        console.error('Error put putWorkingData : ', error);
    }
};

// 검색어 등록 조회
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

// 검색어 업데이트
export const putSearchWord = async (data) => {
    let reqUrl = `/api/postSearchWord`;

    try {
        const response = await apiProducts.post(reqUrl, data);
        return response.data; // 응답 데이터를 반환하여 호출한 곳에서 사용할 수 있게 함
    } catch (error) {
        console.error('Error updating putSearchWord data:', error);
        throw error; // 에러를 다시 던져서 호출한 곳에서 에러 처리할 수 있게 함
    }
};

// 추천 검색어 검색
export const getAutoReco = async (data, page = 1, limit = 50, flag) => {
    let reqUrl = `/api/getAutoReco?page=${page}&limit=${limit}&flag=${flag}`;
    if (data) {
        reqUrl += `&search=${data}`;
    }
    try {
        const response = await apiProducts.get(reqUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching getAutoReco data:', error);
        throw error;
    }
};

// 상품명 저장
export const putProductName = async (data) => {
    let reqUrl = `/api/putProductName`;
    try {
        const response = await apiProducts.put(reqUrl, data);
        return response;
    } catch (error) {
        console.error('Error put putWorkingData : ', error);
    }
};

// 상품 태그 업데이트
export const putProductTag = async (data) => {
    let reqUrl = `/api/putProductTag`;
    try {
        const response = await apiProducts.put(reqUrl, data);
        return response;
    } catch (error) {
        console.error('Error put putProductTag : ', error);
        throw error;
    }
};

// 상품 카테고리 업데이트
export const putProductCategory = async (data) => {
    let reqUrl = `/api/putProductCategory`;
    try {
        const response = await apiProducts.put(reqUrl, data);
        return response.data;
    } catch (error) {
        console.error('Error put postProcessCategory:', error);
        throw error;
    }
};

// 카테고리 상품 조회
export const getCateProduct = async (data, page = 1, limit = 50) => {
    let reqUrl = `/api/getCateProduct?page=${page}&limit=${limit}`;
    if (data) {
        reqUrl += `&search=${data}`;
    }
    try {
        const response = await apiProducts.get(reqUrl, data);
        return response.data;
    } catch (error) {
        console.error('Error fetching getCateProduct data:', error);
        throw error;
    }
};

export const getProductById = async (id) => {
    let reqUrl = `/api/getProductById?id=${id}`;
    try {
        const response = await apiProducts.get(reqUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching getProductById data:', error);
        throw error;
    }
};
