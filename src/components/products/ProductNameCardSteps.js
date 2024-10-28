import { Col, Empty, Row, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

//테스트 데이터
import productNameTestData from '../../assets/testData/productNameTestData';
import ProductNameCard from './ProductNameCard';
import Search from 'antd/es/input/Search';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { getAutoReco } from '../../apis/productsApi';

const ProductNameCardSteps = () => {
    const [hasMore, setHasMore] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);

    useEffect(() => {
        onSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            onSearch(searchTerm, true);
        }
    }, [page]);

    const onSearch = async (value = searchTerm, isLoadMore = false) => {
        if (searchLoading) return;

        let limit = 100;

        setSearchLoading(true);
        try {
            const response = await getAutoReco(value, isLoadMore ? page : 1, limit);
            const result = response;
            console.log(result);
            if (!isLoadMore) {
                setSearchData(result);
                // setSearchKeywordFocusedIndex(0);
            } else {
                setSearchData((prevData) => [...prevData, ...result]);
            }

            if (result && searchData) {
                if (result.length < limit || searchData.length + result.length >= result[0].total_count) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error(error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    // 테스트 데이터
    const initImageGroup = [
        'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
        'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
        'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
    ];
    // 테스트 데이터
    const modifiedProductTestData = productNameTestData.map((item) => ({
        ...item,
        images: initImageGroup,
    }));

    const [productNameFocusedIndex, setProductNameFocusedIndex] = useState(0);
    const productNameCardRefs = useRef([]);

    const handleProductNameKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setProductNameFocusedIndex((prevIndex) => {
                const newIndex = Math.min(prevIndex + 1, modifiedProductTestData.length - 1);
                productNameCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        } else if (e.key === 'ArrowUp') {
            setProductNameFocusedIndex((prevIndex) => {
                const newIndex = Math.max(prevIndex - 1, 0);
                productNameCardRefs.current[newIndex]?.focusInput();
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
                    />
                </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: '10px' }}>
                <Col span={12} className="getter-row">
                    <p style={{ fontSize: '20px', textAlign: 'right' }}>
                        {' '}
                        상품수: {searchData && searchData.length ? searchData.length : 0}
                    </p>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Space
                        direction="vertical"
                        size="middle"
                        style={{ display: 'flex', width: '100%' }}
                        onKeyDown={handleProductNameKeyDown}
                        tabIndex={0}
                    >
                        {searchData && searchData.length > 0 ? (
                            searchData.map((item, index) => (
                                <ProductNameCard
                                    key={index}
                                    data={item}
                                    isFocused={index === productNameFocusedIndex}
                                    ref={(el) => (productNameCardRefs.current[index] = el)}
                                    onCardFocus={() => setProductNameFocusedIndex(index)}
                                />
                            ))
                        ) : (
                            <Empty />
                        )}
                    </Space>
                </Col>
            </Row>
        </>
    );
};

export default ProductNameCardSteps;
