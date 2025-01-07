import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Space, Empty, Card, Affix, Image } from 'antd';
import Search from 'antd/es/input/Search.js';
import ProductAttributeCard from './ProductAttributeCard.js';
import useInfiniteScroll from '../../hooks/useInfiniteScroll.js';
import { getProductAttributeData, getProductDetailImage } from '../../apis/productsApi.js';
import {
    getProductAttributeValues,
    getProductAttributes,
    getNaverCategory,
    getNaverProductForProvidedNotice,
} from '../../apis/naverCommerceApi.js';
import { resetScroll } from '../../utils/scrollUtils.js';

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
    const [naverCategory, setNaverCategory] = useState([]);
    const [flippedCardIndex, setFlippedCardIndex] = useState(null);
    const [categoryCache, setCategoryCache] = useState({});
    const [naverProductForProvidedNotice, setNaverProductForProvidedNotice] = useState([]);

    useEffect(() => {
        onSearch();
    }, []);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            onSearch(searchTerm, true);
        }
    }, [page]);

    useEffect(() => {
        if (attributeData && attributeData.length > 0) {
            initializeFirstCard();
        }
    }, [attributeData]);

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
        if (index === prevIndex) return;

        setPrevIndex(index);
        setAttributeFocusedIndex(index);

        const detailImageContainer = document.querySelector('.detail-image-container');
        if (detailImageContainer) {
            detailImageContainer.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }

        const categoryId = attributeData[index]?.naver_recoCate_id[0];
        const wholesaleProductId = attributeData[index]?.wholesaleProductId;

        // 카테고리 ID
        const naverRecoCateId1 = categoryId.categoryId1;
        const naverRecoCateId2 = categoryId.categoryId2;
        const naverRecoCateId3 = categoryId.categoryId3;
        const naverRecoCateId4 = categoryId.categoryId4;
        const naverRecoCateId5 = categoryId.categoryId5;

        let lastCategoryId =
            naverRecoCateId5 || naverRecoCateId4 || naverRecoCateId3 || naverRecoCateId2 || naverRecoCateId1 || '';

        const naverProductForProvidedNotice = await getNaverProductForProvidedNotice(lastCategoryId);
        setNaverProductForProvidedNotice(naverProductForProvidedNotice);

        if (lastCategoryId) {
            if (categoryCache[lastCategoryId]) {
                const { attributes, attributeValues, naverCategory } = categoryCache[lastCategoryId];
                setAttributes(attributes);
                setAttributeValues(attributeValues);
                setNaverCategory(naverCategory);
            } else {
                try {
                    const [attribute, attributeValues, naverProductForProvidedNotice, getNaverCategoryData] =
                        await Promise.all([
                            getProductAttributes(lastCategoryId),
                            getProductAttributeValues(lastCategoryId),
                            getNaverProductForProvidedNotice(naverRecoCateId1),
                            getNaverCategory(lastCategoryId),
                        ]);

                    setCategoryCache((prev) => ({
                        ...prev,
                        [lastCategoryId]: {
                            attributes: attribute,
                            attributeValues,
                            naverCategory: getNaverCategoryData,
                        },
                    }));

                    setAttributes(attribute);
                    setAttributeValues(attributeValues);
                    setNaverCategory(getNaverCategoryData);
                } catch (error) {
                    console.error('Error fetching attributes:', error);
                }
            }
        }

        if (wholesaleProductId) {
            try {
                const detailImage = await getProductDetailImage(wholesaleProductId);
                setDetailImage(detailImage);
            } catch (error) {
                console.error('Error fetching detail image:', error);
            }
        }
    };

    const handleCardFlip = (index) => {
        setFlippedCardIndex(index);
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
                                        naverProductForProvidedNotice={naverProductForProvidedNotice}
                                        naverCategory={naverCategory}
                                        isFlipped={index === flippedCardIndex}
                                        onFlip={() => handleCardFlip(index)}
                                    />
                                ))
                            ) : (
                                <Empty description="검색 결과가 없습니다" />
                            )}
                        </Space>
                    </Card>
                </Col>
                <Col span={12}>
                    <Affix offsetTop={24}>
                        {detailImage?.length > 0 ? (
                            <Card title="상품 상세 이미지">
                                <div
                                    className="detail-image-container"
                                    style={{
                                        maxHeight: 'calc(100vh - 200px)',
                                        overflowY: 'auto',
                                        position: 'sticky',
                                        top: '0px',
                                    }}
                                >
                                    {detailImage.map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginBottom: '16px',
                                            }}
                                        >
                                            <img
                                                src={item?.detailImageUrl}
                                                alt="상품 상세 이미지"
                                                style={{
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ) : (
                            <Empty description="상품 상세 이미지가 없습니다" />
                        )}
                    </Affix>
                </Col>
            </Row>
        </div>
    );
};

export default ProductAttributeCardSteps;
