import axios from 'axios';
const timestamp = Date.now();

const apiNaverCommerce = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAccessToken = async () => {
    try {
        const response = await apiNaverCommerce.post('/naverCommerce/getAccessToken');
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
        return response.data;
    } catch (error) {
        console.error('Naver origin area info error', error);
        throw error;
    }
};

// naver 카테고리 조회
export const getNaverCategory = async (categoryId) => {
    try {
        const response = await apiNaverCommerce.get(`/naverCommerce/getNaverCategory/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Naver category error', error);
        throw error;
    }
};

// 상품정보제공고시 상품군 목록 조회
export const getNaverProductForProvidedNotice = async (categoryId) => {
    try {
        const response = await apiNaverCommerce.get(`/naverCommerce/getNaverProductForProvidedNotice/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Naver product for provided notice error', error);
        throw error;
    }
};

// naver 카테고리 목록 조회 - 한달에 한번
export const getNaverCategoryList = async () => {
    try {
        const response = await apiNaverCommerce.get('/naverCommerce/getNaverCategoryList');
        return response.data;
    } catch (error) {
        console.error('Naver category list error', error);
        throw error;
    }
};

// 상품 등록
export const registerNaverProduct = async (productData) => {
    try {
        const response = await apiNaverCommerce.post('/naverCommerce/registerNaverProduct', productData);
        return response.data;
    } catch (error) {
        // 서버에서 보낸 에러 메시지가 있으면 그것을 사용
        if (error.response?.data?.details?.message) {
            throw new Error(error.response.data.details.message);
        }
        // invalidInputs 정보가 있으면 첫 번째 에러 메시지 사용
        if (error.response?.data?.details?.invalidInputs?.[0]) {
            throw new Error(error.response.data.details.invalidInputs[0].message);
        }
        // 기본 에러 메시지
        throw new Error('상품 등록 중 오류가 발생했습니다.');
    }
};

// 판매자 주소록 조회
export const getNaverSellerAddressBook = async () => {
    try {
        const response = await apiNaverCommerce.get('/naverCommerce/getNaverSellerAddressBook');
        return response.data;
    } catch (error) {
        console.error('Naver seller address book error', error);
        throw error;
    }
};

// 태그 조회
export const getNaverTagInfo = async (keyword) => {
    try {
        const response = await apiNaverCommerce.get(`/naverCommerce/getNaverTagInfo/${keyword}`);
        return response.data;
    } catch (error) {
        console.error('Naver tag info error', error);
        throw error;
    }
};
