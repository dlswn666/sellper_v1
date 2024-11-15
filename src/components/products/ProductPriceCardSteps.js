import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Space, Empty } from 'antd';
import Search from 'antd/es/input/Search';
import ProductPriceCard from './ProductPriceCard';
import { getProductPriceData } from '../../apis/productsApi';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

const ProductPriceCardSteps = () => {
    const [searchData, setSearchData] = useState([]);
    const [productPriceFocusedIndex, setProductPriceFocusedIndex] = useState(0);
    const productPriceCardRefs = useRef([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasMore, setHasMore] = useState(true);

    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);

    useEffect(() => {
        onSearch();
    }, []);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            onSearch(searchTerm, true);
        }
    }, [page]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        setHasMore(true);
        setSearchData([]);
        setPage(1);
        onSearch(value);
    };

    const onSearch = async (value = searchTerm, isLoadMore = false) => {
        if (searchLoading) return;

        let limit = 100;
        setSearchLoading(true);

        try {
            const response = await getProductPriceData(value, isLoadMore ? page : 1, limit);
            console.log(response);
            const result = response;

            if (!isLoadMore) {
                setSearchData(result);
                setProductPriceFocusedIndex(0);
            } else {
                setSearchData((prevData) => [...prevData, ...result]);
            }

            if (result && searchData) {
                if (result.length < limit || searchData.length + result.length >= result[0].total_count) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    const onFocusProductPriceCard = (index) => {
        setProductPriceFocusedIndex(index);
    };

    const handleProductPriceKeyDown = (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
            setProductPriceFocusedIndex((prevIndex) => {
                const newIndex = Math.min(prevIndex + 1, searchData.length - 1);
                productPriceCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        } else if (e.key === 'ArrowUp') {
            setProductPriceFocusedIndex((prevIndex) => {
                const newIndex = Math.max(prevIndex - 1, 0);
                productPriceCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        }
    };

    return (
        <>
            <Row>
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
            <Row gutter={16} style={{ marginBottom: '10px' }}>
                <Col span={12} className="getter-row">
                    <p style={{ fontSize: '20px', textAlign: 'right' }}>
                        상품수: {searchData && searchData.length ? searchData.length : 0}
                    </p>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Space
                        direction="vertical"
                        size="middle"
                        style={{ display: 'flex', width: '100%' }}
                        onKeyDown={handleProductPriceKeyDown}
                        tabIndex={0}
                    >
                        {searchData && searchData.length > 0 ? (
                            searchData.map((item, index) => (
                                <ProductPriceCard
                                    key={index}
                                    data={item}
                                    isFocused={index === productPriceFocusedIndex}
                                    ref={(el) => (productPriceCardRefs.current[index] = el)}
                                    onCardFocus={() => onFocusProductPriceCard(index)}
                                />
                            ))
                        ) : (
                            <Empty description="검색 결과가 없습니다" />
                        )}
                    </Space>
                </Col>
            </Row>
        </>
    );
};

export default ProductPriceCardSteps;
