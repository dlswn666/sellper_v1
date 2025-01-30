import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Row, Col, Space, Empty, Card, Affix } from 'antd';
import Search from 'antd/es/input/Search.js';
import ProductAttributeCard from './ProductAttributeCard.js';
import useInfiniteScroll from '../../hooks/useInfiniteScroll.js';
import { getProductAttributeData, getProductDetailImage } from '../../apis/productsApi.js';

const ProductAttributeCardSteps = () => {
    const [attributeData, setAttributeData] = useState([]);
    const [attributeFocusedIndex, setAttributeFocusedIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);
    const attributeCardRefs = useRef([]);
    const [detailImage, setDetailImage] = useState([]);
    const [flippedCardIndex, setFlippedCardIndex] = useState(null);
    const [offset, setOffset] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const onFocusAttributeCard = async (index) => {
        if (index === prevIndex && !isSaved) return;
        console.log('index', index);

        setAttributeFocusedIndex(index);
        setPrevIndex(index);

        const wholesaleProductId = attributeData[index]?.wholesaleProductId;
        console.log('wholesaleProductId', wholesaleProductId);

        if (wholesaleProductId) {
            try {
                const detailImage = await getProductDetailImage(wholesaleProductId);
                setDetailImage(detailImage);
            } catch (error) {
                console.error('Error fetching detail image:', error);
            }
        }
    };

    useEffect(() => {
        if (attributeData && attributeData.length > 0) {
            onFocusAttributeCard(attributeFocusedIndex);
        }
    }, [attributeFocusedIndex, attributeData]);

    // const initializeFirstCard = useCallback(() => {
    //     setTimeout(() => {
    //         attributeCardRefs.current[0]?.focusInput();
    //         onFocusAttributeCard(0);
    //     }, 100);
    // }, [onFocusAttributeCard]);

    // useEffect(() => {
    //     if (attributeData && attributeData.length > 0) {
    //         initializeFirstCard();
    //     }
    // }, [attributeData, initializeFirstCard]);

    useEffect(() => {
        onSearch();
    }, []);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            onSearch('', searchTerm, true);
        }
    }, [page]);

    useEffect(() => {
        if (attributeFocusedIndex >= 0 && attributeCardRefs.current[attributeFocusedIndex]) {
            attributeCardRefs.current[attributeFocusedIndex]?.focusInput();
        }
    }, [attributeFocusedIndex]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        setHasMore(true);
        setAttributeData([]);
        setPage(1);
        onSearch('', value, true, 1);
    };

    const handleSaveSuccess = async (savedProductId) => {
        const savedItemIndex = attributeData.findIndex((item) => item.wholesaleProductId === savedProductId);
        if (savedItemIndex === -1) return;

        try {
            const newData = await getProductAttributeData('', '', 1, 1, 'attributeSaved', offset);
            setAttributeData((prevData) => {
                const newArray = [...prevData];
                newArray.splice(savedItemIndex, 1);

                if (newData && newData.length > 0) {
                    newArray.push(...newData);
                }
                return newArray;
            });

            setOffset((prev) => prev + 1);
            setIsSaved(true);
            onFocusAttributeCard(attributeFocusedIndex);
        } catch (error) {
            console.error('Error fetching attributes:', error);
        }
    };

    const onSearch = async (productId = '', search = searchTerm, isLoadMore = false, currentPage = page) => {
        if (searchLoading) return;
        setSearchLoading(true);
        setIsSaved(false);
        try {
            const result = await getProductAttributeData(
                productId,
                search,
                isLoadMore ? currentPage : 1,
                limit,
                'attribute'
            );
            setTotalCount(result[0].total_count);
            if (!isLoadMore) {
                setAttributeData(result);
                setOffset(limit);
            } else {
                setAttributeData((prev) => [...prev, ...result]);
                setOffset((prev) => prev + result.length);
            }
            if (currentPage === 1) {
                setAttributeFocusedIndex(0);
            }
            setHasMore(result.length >= limit);
        } catch (error) {
            console.error('Error fetching attributes:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setSearchLoading(false);
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
                        onSearch={(value) => handleSearch(value)}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title={`조회 작업 상품 : ${attributeData.length}개 / 총 작업 상품 : ${totalCount} 개`}>
                        <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                            {attributeData?.length > 0 ? (
                                attributeData.map((item, index) => (
                                    <ProductAttributeCard
                                        key={`${item.productId}-${index}`}
                                        data={item}
                                        index={index}
                                        isFocused={index === attributeFocusedIndex}
                                        ref={(el) => (attributeCardRefs.current[index] = el)}
                                        onCardFocus={() => onFocusAttributeCard(index)}
                                        isFlipped={index === flippedCardIndex}
                                        onFlip={() => handleCardFlip(index)}
                                        onSaveSuccess={handleSaveSuccess}
                                        offset={offset}
                                        limit={limit}
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
