import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Space, Empty, Card } from 'antd';
import Search from 'antd/es/input/Search.js';
import ProductAttributeCard from './ProductAttributeCard.js';
import useInfiniteScroll from '../../hooks/useInfiniteScroll.js';
import { getProductAttributeData, getProductDetailImage } from '../../apis/productsApi.js';
import { getProductAttributeValues, getProductAttributes, getAccessToken } from '../../apis/naverCommerceApi.js';

const ProductAttributeCardSteps = () => {
    const [attributeData, setAttributeData] = useState([]);
    const [attributeFocusedIndex, setAttributeFocusedIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);
    const attributeCardRefs = useRef([]);
    const [attributes, setAttributes] = useState([]);
    const [attributeValues, setAttributeValues] = useState([]);
    const [detailImage, setDetailImage] = useState([]);

    useEffect(() => {
        onSearch();
    }, []);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            onSearch(searchTerm, true);
        }
    }, [page]);

    const initializeFirstCard = () => {
        setTimeout(() => {
            attributeCardRefs.current[0]?.focusInput();
            onFocusAttributeCard(0);
        }, 100);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setHasMore(true);
        setAttributeData([]);
        setPage(1);
        onSearch(value);
    };

    const onSearch = async (productId = '', search = searchTerm, isLoadMore = false) => {
        if (searchLoading) return;
        setSearchLoading(true);

        try {
            const result = await getProductAttributeData(productId, search, isLoadMore ? page : 1, 100);
            console.log(result);
            if (!isLoadMore) {
                setAttributeData(result);
                setAttributeFocusedIndex(0);
            } else {
                setAttributeData((prev) => [...prev, ...result]);
            }
            setHasMore(result.length >= 100);
        } catch (error) {
            console.error('Error fetching attributes:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    const onFocusAttributeCard = async (index) => {
        setPrevIndex(index);
        setAttributeFocusedIndex(index);
        const categoryId = attributeData[index]?.naver_recoCate_id[0];
        const wholesaleProductId = attributeData[index]?.wholesaleProductId;
        console.log('wholesaleProductId', wholesaleProductId);

        // 카테고리 ID
        const naverRecoCateId1 = categoryId.categoryId1;
        const naverRecoCateId2 = categoryId.categoryId2;
        const naverRecoCateId3 = categoryId.categoryId3;
        const naverRecoCateId4 = categoryId.categoryId4;
        const naverRecoCateId5 = categoryId.categoryId5;
        let lastCategoryId = '';
        switch (true) {
            case naverRecoCateId5 && naverRecoCateId5 !== '':
                lastCategoryId = naverRecoCateId5;
                break;
            case naverRecoCateId4 && naverRecoCateId4 !== '':
                lastCategoryId = naverRecoCateId4;
                break;
            case naverRecoCateId3 && naverRecoCateId3 !== '':
                lastCategoryId = naverRecoCateId3;
                break;
            case naverRecoCateId2 && naverRecoCateId2 !== '':
                lastCategoryId = naverRecoCateId2;
                break;
            case naverRecoCateId1 && naverRecoCateId1 !== '':
                lastCategoryId = naverRecoCateId1;
                break;
        }
        if (lastCategoryId) {
            try {
                const attribute = await getProductAttributes(lastCategoryId);
                const attributeValues = await getProductAttributeValues(lastCategoryId);

                setAttributes(attribute);
                setAttributeValues(attributeValues);
            } catch (error) {
                console.error('Error fetching attributes:', error);
            }
        }
        if (wholesaleProductId) {
            const detailImage = await getProductDetailImage(wholesaleProductId);
            setDetailImage(detailImage);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row style={{ marginBottom: '16px' }}>
                <Col span={24}>
                    <Search
                        placeholder="상품 검색어를 입력해 주세요"
                        enterButton="Search"
                        size="large"
                        loading={searchLoading}
                        onSearch={handleSearch}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title={`작업 상품 목록 (${attributeData.length}개)`}>
                        <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                            {attributeData?.length > 0 ? (
                                attributeData.map((item, index) => (
                                    <ProductAttributeCard
                                        key={item.productId}
                                        data={item}
                                        isFocused={index === attributeFocusedIndex}
                                        ref={(el) => (attributeCardRefs.current[index] = el)}
                                        onCardFocus={() => onFocusAttributeCard(index)}
                                        attributeValues={attributeValues}
                                        attributes={attributes}
                                    />
                                ))
                            ) : (
                                <Empty description="검색 결과가 없습니다" />
                            )}
                        </Space>
                    </Card>
                </Col>
                <Col span={12}>
                    {detailImage?.length > 0 && (
                        <Card title="상품 상세 이미지">
                            {detailImage.map((item) => (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img src={item?.path} alt="상품 상세 이미지" />
                                </div>
                            ))}
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ProductAttributeCardSteps;
