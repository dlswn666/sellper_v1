import { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Empty, Affix, Button, Input, Tooltip, Space, Divider, Typography } from 'antd';
import { SaveOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search.js';
import { getProductOption } from '../../apis/productsApi.js';
import ProductOptionPriceCard from './ProductOptionPriceCard.js';
import useInfiniteScroll from '../../hooks/useInfiniteScroll.js';

const ProductOptionPriceCardSteps = () => {
    const [searchLoading, setSearchLoading] = useState(false);
    const [productOptionData, setProductOptionData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);
    const productOptionCardRefs = useRef([]);
    const [prevIndex, setPrevIndex] = useState(0);
    const [productOptionFocusedIndex, setProductOptionFocusedIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [optionEditData, setOptionEditData] = useState({});

    const { Text } = Typography;

    useEffect(() => {
        getProductOptionData();
    }, []);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            getProductOptionData();
        }
    }, [page]);

    useEffect(() => {
        if (productOptionData?.length > 0) {
            initializeFirstCard();
        }
    }, [productOptionData]);

    const initializeFirstCard = () => {
        setTimeout(() => {
            productOptionCardRefs.current[0]?.focusInput();
            onFocusProductOptionCard(0);
        }, 100);
    };

    const onFocusProductOptionCard = (index) => {
        setPrevIndex(index);
        setProductOptionFocusedIndex(index);
        handleOptionData(index);
    };

    const handleOptionData = (index) => {
        const optionData = {
            ...productOptionData[index],
            marginPercent: 30,
        };
        // 옵션 가격 임의 설정 test
        optionData.optionPrice = '+300, +200, +300';
        let optionPrice = optionData.optionPrice.split(',');
        optionPrice = optionPrice.map((price) => parseInt(price));

        let optionValueJoin = '';
        //옵션 값 설정
        optionData.optionProduct.forEach((option, index) => {
            if (index === optionData.optionProduct.length - 1) {
                optionValueJoin += `${option.optionValue} : ${parseInt(option.optionPrice)}`;
            } else {
                optionValueJoin += `${option.optionValue} : ${parseInt(option.optionPrice)}\r\n`;
            }
        });
        optionData.optionValueJoin = optionValueJoin;

        setOptionEditData(optionData);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setHasMore(true);
        setProductOptionData([]);
        setPage(1);
        getProductOptionData(value);
    };

    const getProductOptionData = async (productId, isLoadMore = false) => {
        if (searchLoading) return;
        setSearchLoading(true);
        try {
            const response = await getProductOption(productId, 100, isLoadMore ? page : 1);
            console.log(response);
            if (!isLoadMore) {
                setProductOptionData(response.data);
                setProductOptionFocusedIndex(0);
            } else {
                setProductOptionData((prev) => [...prev, ...response.data]);
            }
            setHasMore(response.data.length >= 100);
        } catch (error) {
            console.error('Error fetching product option data:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    const handleSave = (index) => {
        console.log(index);
    };

    const handlePriceChange = (index, key, value) => {
        setOptionEditData((prev) => ({
            ...prev,
            [key]: value,
        }));
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
                    <Card title={`작업 상품 목록 (${productOptionData.length}개)`}>
                        <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                            {productOptionData.length > 0 ? (
                                productOptionData.map((item, index) => (
                                    <ProductOptionPriceCard
                                        key={item.productOptionId}
                                        data={item}
                                        isFocused={productOptionFocusedIndex === index}
                                        onCardFocus={() => onFocusProductOptionCard(index)}
                                        ref={(el) => (productOptionCardRefs.current[index] = el)}
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
                        <Card
                            title="가격 설정 정보"
                            onKeyDown={handleKeyPress}
                            style={{
                                maxHeight: 'calc(100vh - 200px)',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                            }}
                        >
                            {optionEditData ? (
                                <div>
                                    <div
                                        style={{
                                            marginBottom: 16,
                                            padding: '20px',
                                            background: '#f8f9fa',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div style={{ flex: 2 }}>
                                                <h2
                                                    style={{
                                                        color: '#1890ff',
                                                        marginBottom: '4px',
                                                        fontSize: '16px',
                                                    }}
                                                >
                                                    상품 이름
                                                </h2>
                                                <p
                                                    style={{
                                                        fontSize: '20px',
                                                        fontWeight: 500,
                                                        color: '#262626',
                                                        margin: 0,
                                                    }}
                                                >
                                                    {optionEditData?.productName}
                                                </p>
                                            </div>
                                            <div
                                                style={{
                                                    width: '1px',
                                                    height: '100%',
                                                    background: '#e8e8e8',
                                                    margin: '0 24px',
                                                }}
                                            ></div>
                                            <div style={{ flex: 1 }}>
                                                <h2
                                                    style={{
                                                        color: '#1890ff',
                                                        marginBottom: '4px',
                                                        fontSize: '16px',
                                                    }}
                                                >
                                                    도매 판매가
                                                </h2>
                                                <p
                                                    style={{
                                                        fontSize: '20px',
                                                        fontWeight: 500,
                                                        color: '#262626',
                                                        margin: 0,
                                                    }}
                                                >
                                                    {optionEditData?.productPrice}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider className="divider" />
                                    <h3>옵션별 판매 가격</h3>
                                    <Space
                                        direction="vertical"
                                        size="middle"
                                        style={{
                                            display: 'flex',
                                            width: '100%',
                                            minHeight: 'calc(100vh - 200px)',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        <Card
                                            key={optionEditData.productOptionId}
                                            size="small"
                                            className="platform-price-card"
                                            extra={
                                                <Button
                                                    type="primary"
                                                    icon={<SaveOutlined />}
                                                    size="small"
                                                    onClick={() => handleSave(productOptionFocusedIndex)}
                                                >
                                                    저장
                                                </Button>
                                            }
                                        >
                                            <Row justify="space-between" align="middle" gutter={[16, 16]}>
                                                <Col span={24}>
                                                    <Row gutter={[16, 16]}>
                                                        <Col span={12}>
                                                            <div className="price-input-group">
                                                                <Text type="secondary">옵션 단순 마진율</Text>
                                                                <Input
                                                                    value={optionEditData.marginPercent}
                                                                    onChange={(e) => {
                                                                        handlePriceChange(
                                                                            productOptionFocusedIndex,
                                                                            'marginPercent',
                                                                            e.target.value
                                                                        );
                                                                    }}
                                                                    suffix="%"
                                                                    addonAfter={
                                                                        <Tooltip title="도매 판매가 옵션에 대한 단순 마진율입니다">
                                                                            <InfoCircleOutlined />
                                                                        </Tooltip>
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col span={12}>
                                                            <div className="price-input-group">
                                                                <Text type="secondary">옵션 단순 마진액</Text>
                                                                <Input
                                                                    value={optionEditData.marginPrice}
                                                                    disabled
                                                                    suffix="원"
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Divider className="divider" />
                                            <h3>옵션 설정</h3>
                                            <Row gutter={[16, 16]} justify="space-between" align="middle">
                                                <Col span={12}>
                                                    <div className="price-input-group">
                                                        <Text type="secondary">옵션 이름</Text>
                                                        <Input
                                                            value={optionEditData.optionName}
                                                            onChange={(e) => {
                                                                handlePriceChange(
                                                                    productOptionFocusedIndex,
                                                                    'optionName',
                                                                    e.target.value
                                                                );
                                                            }}
                                                            addonAfter={
                                                                <Tooltip
                                                                    title={
                                                                        <>
                                                                            여러 옵션 있을 경우 &nbsp;&nbsp; <br />
                                                                            , 로 구분해 주세요 &nbsp;&nbsp; <br />
                                                                            예) 색상, 사이즈
                                                                        </>
                                                                    }
                                                                >
                                                                    <InfoCircleOutlined />
                                                                </Tooltip>
                                                            }
                                                        />
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <div className="price-input-group">
                                                        <Text type="secondary">옵션 값</Text>
                                                        <Input
                                                            value={optionEditData.optionValueJoin}
                                                            onChange={(e) => {
                                                                handlePriceChange(
                                                                    productOptionFocusedIndex,
                                                                    'optionValueJoin',
                                                                    e.target.value
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Divider className="divider" />
                                            <Row>
                                                <Col span={12}>
                                                    <div className="price-input-group">
                                                        <Text type="secondary">옵션 가격</Text>
                                                        <Input
                                                            value={optionEditData.optionPrice}
                                                            onChange={(e) => {
                                                                handlePriceChange(
                                                                    productOptionFocusedIndex,
                                                                    'optionPrice',
                                                                    e.target.value
                                                                );
                                                            }}
                                                            suffix="원"
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Space>
                                </div>
                            ) : (
                                <Empty description="검색 결과가 없습니다" />
                            )}
                        </Card>
                    </Affix>
                </Col>
            </Row>
        </div>
    );
};

export default ProductOptionPriceCardSteps;
