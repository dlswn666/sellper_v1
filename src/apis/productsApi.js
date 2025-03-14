import axios from 'axios';

const apiProducts = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
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
        return response.data;
    } catch (error) {
        console.error('Error put putWorkingData : ', error);
        throw error;
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
export const getAutoReco = async (search, page = 1, limit = 50, flag, offset, productId) => {
    let reqUrl = `/api/getAutoReco?page=${page}&limit=${limit}&flag=${flag}`;
    if (search) {
        reqUrl += `&search=${search}`;
    }
    console.log('productId', productId);
    if (productId) {
        reqUrl += `&productId=${productId}`;
    }
    if (offset) {
        reqUrl += `&savedDataOffset=${offset}`;
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
export const postProductTag = async (data) => {
    let reqUrl = `/api/postProductTag`;
    try {
        const response = await apiProducts.post(reqUrl, data);
        return response.data;
    } catch (error) {
        console.error('Error post postProductTag : ', error);
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

// 상품 가격 데이터 조회
export const getProductPriceData = async (productId = '', search = '', page = 1, limit = 50) => {
    const offset = (page - 1) * limit;
    let url = `/api/getProductPriceData?limit=${limit}&offset=${offset}`;
    console.log('search', search);
    if (productId) {
        url += `&productId=${productId}`;
    }
    if (search) {
        url += `&search=${search}`;
    }
    try {
        const response = await apiProducts.get(url);

        return response.data;
    } catch (error) {
        console.error('Error fetching product price data:', error);
        throw error;
    }
};

// 플랫폼별 가격 정보 조회
export const getPlatformPriceById = async (productId) => {
    try {
        const response = await apiProducts.get(`/api/getPlatformPriceById?productId=${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching platform price data:', error);
        throw error;
    }
};

// 플랫폼 가격 정보 수정
export const putPlatformPrice = async (data) => {
    let reqUrl = `/api/putPlatformPrice`;
    try {
        const response = await apiProducts.put(reqUrl, data);
        return response.data;
    } catch (error) {
        console.error('Error put putPlatformPrice:', error);
        throw error;
    }
};

// 상품 속성 데이터 조회
export const getProductAttributeData = async (productId, search, page = 1, limit = 100, flag = '', paramOffset = 0) => {
    let offset = (page - 1) * limit;
    if (flag === 'attributeSaved') {
        offset = paramOffset;
    }
    let reqUrl = `/api/getProductAttributeData?limit=${limit}&offset=${offset}&flag=${flag}`;
    if (productId) {
        reqUrl += `&productId=${productId}`;
    }
    if (search) {
        reqUrl += `&search=${search}`;
    }
    try {
        const response = await apiProducts.get(reqUrl);
        console.log('response', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching product attribute data:', error);
        throw error;
    }
};

// 상품 상세 이미지 조회
export const getProductDetailImage = async (wholesaleProductId) => {
    let reqUrl = `/api/getProductDetailImage?wholesaleProductId=${wholesaleProductId}`;
    try {
        const response = await apiProducts.get(reqUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching product detail image:', error);
        throw error;
    }
};

// 상품 옵션 조회
export const getProductOption = async (productId, limit = 100, page = 1) => {
    const offset = (page - 1) * limit;
    let reqUrl = `/api/getProductOption?limit=${limit}&offset=${offset}`;

    if (productId) {
        reqUrl += `&productId=${productId}`;
    }
    console.log('getProductOption', reqUrl);
    try {
        const response = await apiProducts.get(reqUrl);
        return response;
    } catch (error) {
        console.error('Error fetching product option:', error);
        throw error;
    }
};

// 옵션 설정 조회
export const getOptionSettings = async (data) => {
    const { productsId, wholesaleProductId, platform, createUser } = data;
    let reqUrl = `/api/getOptionSettings?productsId=${productsId}&wholesaleProductId=${wholesaleProductId}&platform=${platform}&createUser=${createUser}`;
    try {
        const response = await apiProducts.get(reqUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching option settings:', error);
        throw error;
    }
};

// 옵션 설정 저장
export const postOptionSettings = async (data) => {
    let reqUrl = `/api/postOptionSettings`;
    try {
        const response = await apiProducts.post(reqUrl, data);
        return response.data;
    } catch (error) {
        console.error('Error posting option settings:', error);
        throw error;
    }
};

// 배송사 조회
export const getDeliveryCompanies = async () => {
    let reqUrl = `/api/getDeliveryCompanies`;
    try {
        const response = await apiProducts.get(reqUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching delivery companies:', error);
        throw error;
    }
};

// 상품 상세 정보 저장
export const postProductAttribute = async (data) => {
    let reqUrl = `/api/postProductAttribute`;
    try {
        const response = await apiProducts.post(reqUrl, data);
        return response.data;
    } catch (error) {
        console.error('Error posting product attribute:', error);
        throw error;
    }
};

// 썸네일 업로드
export const postProductThumbnail = async (data) => {
    const reqUrl = `/api/postProductThumbnail`;
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    try {
        const response = await apiProducts.post(reqUrl, data, config);

        if (!response.data.success) {
            throw new Error(response.data.message || '이미지 업로드 실패');
        }
        return response;
    } catch (error) {
        console.error('Error posting product thumbnail:', error);
        throw error.response?.data || error;
    }
};

// 상품 이미지 조회
export const getProductThumbnail = async (wholesaleProductId) => {
    let reqUrl = `/api/getProductThumbnail?wholesaleProductId=${wholesaleProductId}`;
    try {
        const response = await apiProducts.get(reqUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching product thumbnail:', error);
        throw error;
    }
};

// 상품 최종 정보 조회
export const getFinalProductData = async (param) => {
    const { limit, page, productId, searchTerm } = param;
    let reqUrl = `/api/getFinalProductData?limit=${limit}&page=${page}`;

    if (productId) {
        reqUrl += `&productId=${productId}`;
    }
    if (searchTerm) {
        reqUrl += `&searchTerm=${searchTerm}`;
    }

    try {
        const response = await apiProducts.get(reqUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching final product data:', error);
        throw error;
    }
};

// 네이버 이미지 업로드
export const postNaverProductThumbnail = async (data) => {
    let reqUrl = `/api/postNaverProductThumbnail`;
    try {
        const response = await apiProducts.post(reqUrl, data);
        return response.data;
    } catch (error) {
        console.error('Error posting naver product thumbnail:', error);
        throw error;
    }
};

// 썸네일 삭제
export const deleteProductThumbnail = async (imgId) => {
    let reqUrl = `/api/deleteProductThumbnail?imgId=${imgId}`;
    try {
        const response = await apiProducts.delete(reqUrl);
        return response.data;
    } catch (error) {
        console.error('Error deleting product thumbnail:', error);
        throw error;
    }
};

// 상품 상태 업데이트
export const putProductStage = async (data) => {
    let reqUrl = `/api/putProductStage`;
    try {
        const response = await apiProducts.put(reqUrl, data);
        return response.data;
    } catch (error) {
        console.error('Error putting product stage:', error);
        throw error;
    }
};

// 태그 저장
export const putProductTag = async (data) => {
    let reqUrl = `/api/putProductTag`;
    console.log('data****************************', data);
    try {
        const response = await apiProducts.put(reqUrl, data);
        return response.data;
    } catch (error) {
        console.error('Error putting product tag:', error);
        throw error;
    }
};

// 상품 삭제
export const deleteProduct = async (data) => {
    let reqUrl = `/api/deleteProduct`;
    try {
        const response = await apiProducts.delete(reqUrl, { data });
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

export const processGetAutoReco = async () => {
    const url = `/naverSearch/postAutoReco`;
    try {
        const response = await apiProducts.post(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching auto reco:', error);
        throw error;
    }
};
