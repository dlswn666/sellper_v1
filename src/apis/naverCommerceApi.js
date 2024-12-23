import axios from 'axios';

const timestamp = Date.now();

const apiNaverCommerce = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAccessToken = async () => {
    try {
        const response = await apiNaverCommerce.post('/naverCommerce/getAccessToken');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Naver access token error', error);
        throw error;
    }
};

// 카테고리별 속성값 조회
export const getProductAttributeValues = async (categoryId) => {
    try {
        const response = await apiNaverCommerce.get(`/naverCommerce/getProductAttributeValues/${categoryId}`);
        const groupedData = response.data.reduce((acc, curr) => {
            acc[curr.attributeSeq] = acc[curr.attributeSeq] || [];
            acc[curr.attributeSeq].push(curr);
            return acc;
        }, {});
        console.log('naver product attribute values groupedData', groupedData);
        return groupedData;
    } catch (error) {
        console.error('Naver product attribute values error', error);
        throw error;
    }
};

// 카테고리별 속성 조회
export const getProductAttributes = async (categoryId) => {
    try {
        const response = await apiNaverCommerce.get(`/naverCommerce/getProductAttributes/${categoryId}`);
        console.log('naver product attributes', response.data);
        return response.data;
    } catch (error) {
        console.error('Naver product attributes error', error);
        throw error;
    }
};

// 원산지 조회
export const getOriginAreaInfo = async () => {
    try {
        const response = await apiNaverCommerce.get('/naverCommerce/getOriginAreaInfo');
        console.log('naver origin area info', response.data);
        return response.data;
    } catch (error) {
        console.error('Naver origin area info error', error);
        throw error;
    }
};
