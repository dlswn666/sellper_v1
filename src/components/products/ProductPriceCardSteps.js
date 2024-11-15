import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Space, Empty, Card, Button, message, Affix } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import ProductPriceCard from './ProductPriceCard';
import { getProductPriceData, getProductById, getPlatformPriceById } from '../../apis/productsApi';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import '../../css/productNameCard.css';

const ProductPriceCardSteps = () => {
    const [searchData, setSearchData] = useState([]);
    const [productPriceFocusedIndex, setProductPriceFocusedIndex] = useState(0);
    const productPriceCardRefs = useRef([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [prevIndex, setPrevIndex] = useState(null);
    const [platformPrices, setPlatformPrices] = useState([]);

    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);

    useEffect(() => {
        onSearch();
    }, []);

    useEffect(() => {
        if (searchData?.length > 0) {
            initializeFirstCard();
        }
    }, [searchData]);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            onSearch(searchTerm, true);
        }
    }, [page]);

    const initializeFirstCard = () => {
        setTimeout(() => {
            productPriceCardRefs.current[0]?.focusInput();
            onFocusProductPriceCard(0);
        }, 100);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setHasMore(true);
        setSearchData([]);
        setPage(1);
        onSearch(value);
    };

    const onSearch = async (value = searchTerm, isLoadMore = false) => {
        if (searchLoading) return;
        setSearchLoading(true);

        try {
            const result = await getProductPriceData(value, isLoadMore ? page : 1, 100);

            if (!isLoadMore) {
                setSearchData(result);
                setProductPriceFocusedIndex(0);
            } else {
                setSearchData((prev) => [...prev, ...result]);
            }

            setHasMore(result.length >= 100);
        } catch (error) {
            console.error('Error fetching data:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    const handlePriceUpdate = async (index) => {
        if (prevIndex === null || !productPriceCardRefs.current[prevIndex]) return;

        const prevCard = productPriceCardRefs.current[prevIndex];
        const newPrice = prevCard.getNewPrice();

        if (!newPrice || !searchData[prevIndex]) return;

        try {
            // TODO: API 호출 구현
            // await updateProductPrice({
            //     productId: searchData[prevIndex].productId,
            //     newPrice: newPrice
            // });
            message.success('가격이 성공적으로 업데이트되었습니다.');

            // 개별 상품 정보 업데이트
            const updatedProduct = await getProductById(searchData[prevIndex].workingProductId);

            // 현재 상품 데이터 업데이트
            const newSearchData = [...searchData];
            newSearchData[prevIndex] = {
                ...updatedProduct[0],
                thumbnail: searchData[prevIndex].thumbnail,
            };

            // 업데이트된 상품을 배열 맨 뒤로 이동
            const [movedItem] = newSearchData.splice(prevIndex, 1);
            newSearchData.push(movedItem);

            setSearchData(newSearchData);
            setProductPriceFocusedIndex(0);

            setTimeout(() => {
                productPriceCardRefs.current[0]?.focusInput();
            }, 100);
        } catch (error) {
            console.error('가격 업데이트 중 오류 발생:', error);
            message.error('가격 업데이트에 실패했습니다.');
        }
    };

    const fetchPlatformPrices = async (productId) => {
        try {
            const result = await getPlatformPriceById(productId);
            setPlatformPrices(result);
        } catch (error) {
            console.error('Failed to fetch platform prices:', error);
            message.error('가격 정보를 불러오는데 실패했습니다.');
        }
    };

    const onFocusProductPriceCard = (index) => {
        handlePriceUpdate(index);
        setPrevIndex(index);
        setProductPriceFocusedIndex(index);

        if (searchData[index]?.workingProductId) {
            fetchPlatformPrices(searchData[index].workingProductId);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row>
                <Col span={24}>
                    <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <Search
                            placeholder="상품 검색어를 입력해 주세요"
                            enterButton="Search"
                            size="large"
                            loading={searchLoading}
                            onSearch={handleSearch}
                            style={{ width: 'calc(100% - 200px)' }}
                        />
                        <Button type="primary" icon={<SaveOutlined />} size="large">
                            변경사항 저장
                        </Button>
                    </Space>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Affix offsetTop={24}>
                        <Card
                            title={`작업 상품 목록 (${searchData.length}개)`}
                            style={{
                                minHeight: 'calc(100vh - 140px)',
                                maxHeight: 'calc(100vh - 140px)',
                                overflowY: 'auto',
                            }}
                            styles={{
                                body: { padding: '12px' },
                            }}
                        >
                            <Space
                                direction="vertical"
                                size="middle"
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    padding: '8px',
                                }}
                            >
                                {searchData?.length > 0 ? (
                                    searchData.map((item, index) => (
                                        <ProductPriceCard
                                            key={item.workingProductId}
                                            data={item}
                                            index={index}
                                            isFocused={index === productPriceFocusedIndex}
                                            ref={(el) => (productPriceCardRefs.current[index] = el)}
                                            onCardFocus={() => onFocusProductPriceCard(index)}
                                            onPriceChange={handlePriceUpdate}
                                        />
                                    ))
                                ) : (
                                    <Empty description="검색 결과가 없습니다" />
                                )}
                            </Space>
                        </Card>
                    </Affix>
                </Col>
                <Col span={12}>
                    <Card
                        title="가격 설정 정보"
                        style={{
                            minHeight: 'calc(100vh - 140px)',
                            maxHeight: 'calc(100vh - 140px)',
                        }}
                        styles={{
                            body: {
                                padding: '16px',
                                height: 'calc(100vh - 200px)',
                                overflowY: 'auto',
                            },
                        }}
                    >
                        {searchData.length > 0 ? (
                            <div>
                                <div style={{ marginBottom: 16 }}>
                                    <h3>기준 판매가</h3>
                                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                        {searchData[productPriceFocusedIndex]?.wholeProductPrice}
                                    </p>
                                </div>
                                <h3>플랫폼별 판매 가격</h3>
                                <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                                    {platformPrices.map((price) => (
                                        <Card key={price.platformPriceId} size="small">
                                            <Row justify="space-between" align="middle">
                                                <Col>
                                                    <h4>
                                                        {price.platformId === 'naver'
                                                            ? '네이버'
                                                            : price.platformId === 'coupang'
                                                              ? '쿠팡'
                                                              : price.platformId === 'gmarket'
                                                                ? 'G마켓'
                                                                : price.platformId === 'elevenst'
                                                                  ? '11번가'
                                                                  : price.platformId}
                                                    </h4>
                                                </Col>
                                                <Col>
                                                    <Space>
                                                        <div>
                                                            <div>
                                                                판매가: {Number(price.salePrice).toLocaleString()}원
                                                            </div>
                                                            {price.discountPrice && (
                                                                <div>
                                                                    할인가:{' '}
                                                                    {Number(price.discountPrice).toLocaleString()}원
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            {price.marginPercent && (
                                                                <div>마진율: {price.marginPercent}%</div>
                                                            )}
                                                            {price.marginPrice && (
                                                                <div>
                                                                    마진액: {Number(price.marginPrice).toLocaleString()}
                                                                    원
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Space>
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))}
                                </Space>
                            </div>
                        ) : (
                            <Empty description="상품을 선택해주세요" />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProductPriceCardSteps;
