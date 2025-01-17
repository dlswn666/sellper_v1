import React, { useState, useRef, useEffect } from 'react';
import {
    Row,
    Col,
    Space,
    Empty,
    Card,
    message,
    Affix,
    Typography,
    Button,
    Input,
    Tooltip,
    Divider,
    InputNumber,
} from 'antd';
import { SaveOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search.js';
import ProductPriceCard from './ProductPriceCard.js';
import { getProductPriceData, getProductById, getPlatformPriceById, putPlatformPrice } from '../../apis/productsApi.js';
import useInfiniteScroll from '../../hooks/useInfiniteScroll.js';
import '../../css/productNameCard.css';

const { Text } = Typography;

const ProductPriceCardSteps = ({ visible, onClose, onSave, initialPrice, platformData }) => {
    const [searchData, setSearchData] = useState([]);
    const [productPriceFocusedIndex, setProductPriceFocusedIndex] = useState(0);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [prevIndex, setPrevIndex] = useState(null);
    const [platformPrices, setPlatformPrices] = useState([]);
    const [naverProductPoint, setNaverProductPoint] = useState({
        reviewPointText: 0,
        reviewPointPhoto: 0,
        reviewPointTextMonth: 0,
        reviewPointPhotoMonth: 0,
    });
    const [dailyProfitTarget, setDailyProfitTarget] = useState(33000);
    const [selectedPlatformIndex, setSelectedPlatformIndex] = useState(0);
    const [finalPlatformPrices, setFinalPlatformPrices] = useState(0);
    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);
    const productPriceCardRefs = useRef([]);
    const salePriceInputRef = useRef(null);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

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

    const onSearch = async (productId = '', search = searchTerm, isLoadMore = false) => {
        if (searchLoading) return;
        setSearchLoading(true);

        try {
            const result = await getProductPriceData(productId, search, isLoadMore ? page : 1, 100);

            // 조회 후 개별 가격 조회
            for (const item of result) {
                const platformPrices = await fetchPlatformPrices(item.workingProductId);
                item.platformPrices = platformPrices;
            }

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

    const fetchPlatformPrices = async (productId) => {
        try {
            const result = await getPlatformPriceById(productId);
            result.forEach((price) => {
                // 판매가를 100원 단위로 올림 처리
                price.salePrice = Math.ceil(price.salePrice / 100) * 100 + price.discountPrice;
                price.discountPercent = Math.round((price.discountPrice / price.salePrice) * 100);
                price.taxPercent = Math.round(price.taxPercent * 100);
                price.marginPercent = Math.round(price.marginPercent * 100);
                price.platformPercent = Math.round(price.platformPercent * 100);
                price.marginPrice =
                    price.salePrice -
                    price.discountPrice -
                    price.taxPrice -
                    price.platformPrice -
                    Number(price.wholesaleProductPrice);
                price.finalPrice = price.salePrice - price.discountPrice;
                price.finalProfitPrice =
                    price.salePrice -
                    price.discountPrice -
                    price.taxPrice -
                    price.platformPrice -
                    Number(price.wholesaleProductPrice);
                price.requiredDailySales =
                    dailyProfitTarget > 0 ? Math.ceil(dailyProfitTarget / price.finalProfitPrice) : 0;
                if (price.platformId === 'naver' && price.naverProductPoint) {
                    price.reviewPointText = price.naverProductPoint.reviewPointText;
                    price.reviewPointPhoto = price.naverProductPoint.reviewPointPhoto;
                    price.reviewPointTextMonth = price.naverProductPoint.reviewPointTextMonth;
                    price.reviewPointPhotoMonth = price.naverProductPoint.reviewPointPhotoMonth;
                }
            });
            return result;
        } catch (error) {
            console.error('Failed to fetch platform prices:', error);
            message.error('가격 정보를 불러오는데 실패했습니다.');
        }
    };

    const onFocusProductPriceCard = (index) => {
        setPrevIndex(index);
        setProductPriceFocusedIndex(index);

        const selectedPlatformPrice = searchData[index].platformPrices[0];
        if (selectedPlatformPrice.platformId === 'naver' && selectedPlatformPrice.naverProductPoint[0]) {
            selectedPlatformPrice.reviewPointText = selectedPlatformPrice.naverProductPoint[0].reviewPointText;
            selectedPlatformPrice.reviewPointPhoto = selectedPlatformPrice.naverProductPoint[0].reviewPointPhoto;
            selectedPlatformPrice.reviewPointTextMonth =
                selectedPlatformPrice.naverProductPoint[0].reviewPointTextMonth;
            selectedPlatformPrice.reviewPointPhotoMonth =
                selectedPlatformPrice.naverProductPoint[0].reviewPointPhotoMonth;
        }
        if (selectedPlatformPrice) {
            setPlatformPrices([selectedPlatformPrice]);
            setTimeout(() => {
                salePriceInputRef.current?.focus();
            }, 100);
        }
    };

    const handlePriceChange = (index, field, value) => {
        let newPlatformPrices = [...platformPrices];
        newPlatformPrices[index] = {
            ...newPlatformPrices[index],
            [field]: value,
        };

        // 모든 필드 변경시 전체 가격 재계산
        const price = newPlatformPrices[index];

        // 자신 필드는 계산하지 않는다

        // 판매가를 100원 단위로 올림 처리
        if (field === 'salePrice') {
            price.salePrice = Math.ceil(price.salePrice / 100) * 100;
        }

        // 1. 할인가 계산
        if (field !== 'discountPrice') {
            price.discountPrice = Math.ceil(price.salePrice * (price.discountPercent / 100));
        }

        // 할인율 계산
        if (field !== 'discountPercent') {
            price.discountPercent = Math.round((price.discountPrice / price.salePrice) * 100);
        }

        // 2. 최종 판매금액 계산
        if (field !== 'finalPrice') {
            price.finalPrice = price.salePrice - price.discountPrice;
            setFinalPlatformPrices(price.finalPrice);
        }

        // 3. 세금액 계산
        if (field !== 'taxPrice') {
            price.taxPrice = Math.ceil(price.finalPrice * (price.taxPercent / 100));
        }

        // 4. 플랫폼 수수료액 계산
        if (field !== 'platformPrice') {
            price.platformPrice = Math.ceil(price.finalPrice * (price.platformPercent / 100));
        }

        // 5. 마진액 계산
        if (field !== 'marginPrice') {
            price.marginPrice =
                price.finalPrice - price.taxPrice - price.platformPrice - Number(price.wholesaleProductPrice);
        }

        // 6. 순이익 계산
        if (field !== 'finalProfitPrice') {
            price.finalProfitPrice = Math.round(price.marginPrice);
        }

        // 7. 마진율 계산
        if (field !== 'marginPercent') {
            price.marginPercent = Math.round((price.marginPrice / price.finalPrice) * 100);
        }

        // 8. 목표 달성을 위한 일일 필요 판매량 계산
        if (field !== 'requiredDailySales') {
            price.requiredDailySales =
                dailyProfitTarget > 0 ? Math.ceil(dailyProfitTarget / price.finalProfitPrice) : 0;
        }

        if (price.salePrice === 0) {
            price.discountPrice = 0;
            price.discountPercent = 0;
            price.finalPrice = 0;
            price.taxPrice = 0;
            price.platformPrice = 0;
            price.marginPrice = 0;
            price.finalProfitPrice = 0;
            price.marginPercent = 0;
            price.requiredDailySales = 0;
            setPlatformPrices(newPlatformPrices);
            return;
        }

        // searchData 업데이트를 별도의 useEffect로 처리
        setPlatformPrices(newPlatformPrices);
    };

    const handleSave = async () => {
        if (prevIndex === null || !productPriceCardRefs.current[prevIndex]) return;
        try {
            for (const item of platformPrices) {
                if (item.platformId === 'naver') {
                    item.reviewPointText = item.reviewPointText
                        ? item.reviewPointText
                        : naverProductPoint.reviewPointText;
                    item.reviewPointPhoto = item.reviewPointPhoto
                        ? item.reviewPointPhoto
                        : naverProductPoint.reviewPointPhoto;
                    item.reviewPointTextMonth = item.reviewPointTextMonth
                        ? item.reviewPointTextMonth
                        : naverProductPoint.reviewPointTextMonth;
                    item.reviewPointPhotoMonth = item.reviewPointPhotoMonth
                        ? item.reviewPointPhotoMonth
                        : naverProductPoint.reviewPointPhotoMonth;
                }
            }
            const result = await putPlatformPrice(platformPrices);
            if (result && result.message === 'success') {
                message.success('가격 정보가 성공적으로 저장되었습니다.');

                // 업데이트된 상품 정보 조회
                const updateProduct = await getProductPriceData(
                    searchData[productPriceFocusedIndex].productId,
                    '',
                    1,
                    1
                );

                if (updateProduct && updateProduct.length > 0) {
                    const newSearchData = [...searchData];
                    const platformPrices = await fetchPlatformPrices(
                        searchData[productPriceFocusedIndex].workingProductId
                    );

                    // 현재 인덱스 저장
                    const currentIndex = productPriceFocusedIndex;

                    // 업데이트된 상품을 배열 끝으로 이동
                    const [movedItem] = newSearchData.splice(currentIndex, 1);
                    movedItem.platformPrices = platformPrices;
                    newSearchData.push(movedItem);

                    setSearchData(newSearchData);

                    // 다음 포커스 인덱스 계산
                    // 현재 인덱스가 마지막 항목이었다면, 새로운 첫 번째 항목으로 이동
                    const nextIndex = currentIndex >= newSearchData.length - 1 ? 0 : currentIndex;

                    // 다음 상품에 포커스 설정
                    setTimeout(() => {
                        setProductPriceFocusedIndex(nextIndex);
                        if (productPriceCardRefs.current[nextIndex]) {
                            productPriceCardRefs.current[nextIndex].focusInput();
                            const nextPlatformPrices = newSearchData[nextIndex].platformPrices;
                            if (nextPlatformPrices && nextPlatformPrices.length > 0) {
                                setPlatformPrices([nextPlatformPrices[0]]);
                            }
                        }
                    }, 100);
                }
            } else {
                message.error('가격 정보 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('저장 중 오류 발생:', error);
            message.error('가격 정보 저장에 실패했습니다.');
        }
    };

    // 숫자 포맷팅 함수 추가
    const formatKRW = (number) => {
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // 추후 플랫폼별 탭 추가
    // const renderPlatformPriceTab = () => {
    //     const platforms = [
    //         { key: 'naver', label: '네이버', dataKey: 'naver_recoCate' },
    //         { key: 'gmarket', label: 'G마켓', dataKey: 'B_recoCate' },
    //         { key: 'C', label: 'C몰', dataKey: 'C_recoCate' },
    //     ];

    //     const items = platforms.map((platform) => ({
    //         key: platform.key,
    //         label: platform.label,
    //         children: renderPlatformPriceCard(platform.key, platform),
    //     }));

    //     return <Tabs items={items} />;
    // };

    // const renderPlatformPriceCard = (platformId, platform) => {
    //     return (
    //         <Row>
    //             <Col span={24}>
    //                 <div>test</div>
    //             </Col>
    //         </Row>
    //     );
    // };

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
                    <Card title={`작업 상품 목록 (${searchData.length}개)`}>
                        <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                            {searchData?.length > 0 ? (
                                searchData.map((item, index) => (
                                    <ProductPriceCard
                                        key={item.workingProductId}
                                        data={item}
                                        index={index + 1}
                                        isFocused={index === productPriceFocusedIndex}
                                        ref={(el) => (productPriceCardRefs.current[index] = el)}
                                        onCardFocus={() => onFocusProductPriceCard(index)}
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
                            {searchData.length > 0 ? (
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
                                                    {searchData[productPriceFocusedIndex]?.productName}
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
                                                    {searchData[productPriceFocusedIndex]?.wholeProductPrice}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider className="divider" />
                                    <h3>플랫폼별 판매 가격</h3>
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
                                        {platformPrices.map((price, index) => (
                                            <Card
                                                key={price.platformPriceId}
                                                size="small"
                                                className="platform-price-card"
                                                actions={[
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'flex-end',
                                                            marginRight: '16px',
                                                        }}
                                                    >
                                                        <Button
                                                            type="primary"
                                                            icon={<SaveOutlined />}
                                                            size="small"
                                                            style={{ width: '100px', height: '40px' }}
                                                            onClick={() => handleSave(index)}
                                                        >
                                                            저장
                                                        </Button>
                                                    </div>,
                                                ]}
                                            >
                                                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                                                    <Col span={24}>
                                                        <div className="platform-header">
                                                            <h4 className="platform-title">
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
                                                        </div>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Row gutter={[16, 16]}>
                                                            <Col span={6}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">할인가</Text>
                                                                    <Input
                                                                        value={formatKRW(price.discountPrice)}
                                                                        onChange={(e) => {
                                                                            const numericValue = e.target.value.replace(
                                                                                /[^0-9]/g,
                                                                                ''
                                                                            );
                                                                            handlePriceChange(
                                                                                index,
                                                                                'discountPrice',
                                                                                parseInt(numericValue) || 0
                                                                            );
                                                                        }}
                                                                        suffix="원"
                                                                    />
                                                                </div>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">할인율</Text>
                                                                    <Input
                                                                        value={price.discountPercent}
                                                                        onChange={(e) =>
                                                                            handlePriceChange(
                                                                                index,
                                                                                'discountPercent',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        suffix="%"
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={6}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">단순 마진율</Text>
                                                                    <Input
                                                                        value={price.marginPercent}
                                                                        onChange={(e) =>
                                                                            handlePriceChange(
                                                                                index,
                                                                                'marginPercent',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        suffix="%"
                                                                        addonAfter={
                                                                            <Tooltip title="도매 판매가에 대한 단순 마진율입니다">
                                                                                <InfoCircleOutlined />
                                                                            </Tooltip>
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">단순 마진액</Text>
                                                                    <Input
                                                                        value={formatKRW(price.marginPrice)}
                                                                        disabled
                                                                        suffix="원"
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={6}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">플랫폼 수수료율 </Text>
                                                                    <Input
                                                                        value={price.platformPercent}
                                                                        onChange={(e) =>
                                                                            handlePriceChange(
                                                                                index,
                                                                                'platformPercent',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        suffix="%"
                                                                    />
                                                                </div>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">플랫폼 수수료액</Text>
                                                                    <Input
                                                                        value={formatKRW(price.platformPrice)}
                                                                        disabled
                                                                        suffix="원"
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={6}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">세금율 </Text>
                                                                    <Input
                                                                        value={price.taxPercent}
                                                                        onChange={(e) =>
                                                                            handlePriceChange(
                                                                                index,
                                                                                'taxPercent',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        suffix="%"
                                                                    />
                                                                </div>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">세금액</Text>
                                                                    <Input
                                                                        value={formatKRW(price.taxPrice)}
                                                                        disabled
                                                                        suffix="원"
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={16}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">판매가</Text>
                                                                    <Input
                                                                        ref={salePriceInputRef}
                                                                        value={formatKRW(price.salePrice)}
                                                                        onChange={(e) => {
                                                                            const numericValue = e.target.value.replace(
                                                                                /[^0-9]/g,
                                                                                ''
                                                                            );
                                                                            handlePriceChange(
                                                                                index,
                                                                                'salePrice',
                                                                                parseInt(numericValue) || 0
                                                                            );
                                                                        }}
                                                                        suffix="원"
                                                                        addonAfter={
                                                                            <Tooltip title="판매가를 수정하면 관련 금액이 자동으로 계산됩니다">
                                                                                <InfoCircleOutlined />
                                                                            </Tooltip>
                                                                        }
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={8}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">순이익</Text>
                                                                    <Input
                                                                        value={formatKRW(price.finalProfitPrice)}
                                                                        disabled
                                                                        suffix="원"
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={16}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">최종 판매금액</Text>
                                                                    <Input
                                                                        value={formatKRW(price.finalPrice)}
                                                                        disabled
                                                                        suffix="원"
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={24}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">일일 순이익 목표</Text>
                                                                    <Input
                                                                        value={formatKRW(dailyProfitTarget)}
                                                                        onChange={(e) => {
                                                                            const numericValue = e.target.value.replace(
                                                                                /[^0-9]/g,
                                                                                ''
                                                                            );
                                                                            setDailyProfitTarget(Number(numericValue));
                                                                            const newPrices = platformPrices.map(
                                                                                (price) => ({
                                                                                    ...price,
                                                                                    requiredDailySales:
                                                                                        Number(numericValue) > 0
                                                                                            ? Math.ceil(
                                                                                                  Number(numericValue) /
                                                                                                      price.finalProfitPrice
                                                                                              )
                                                                                            : 0,
                                                                                })
                                                                            );
                                                                            setPlatformPrices(newPrices);
                                                                        }}
                                                                        suffix="원"
                                                                        addonAfter={
                                                                            <Tooltip title="일일 목표 순이익을 입력하세요">
                                                                                <InfoCircleOutlined />
                                                                            </Tooltip>
                                                                        }
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={8}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">목표 달성 필요 판매량</Text>
                                                                    <Input
                                                                        value={price.requiredDailySales}
                                                                        disabled
                                                                        suffix="개"
                                                                        addonAfter={
                                                                            <Tooltip title="일일 목표 순이익 달성을 위해 필요한 판매 수량입니다">
                                                                                <InfoCircleOutlined />
                                                                            </Tooltip>
                                                                        }
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Divider className="divider" />
                                                        <h4>포인트 설정</h4>
                                                        <Row gutter={[16, 16]}>
                                                            <Col span={12}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">텍스트 리뷰 작성</Text>
                                                                    <InputNumber
                                                                        value={
                                                                            price.reviewPointText
                                                                                ? price.reviewPointText
                                                                                : 10
                                                                        }
                                                                        style={{ width: '100%' }}
                                                                        onChange={(value) =>
                                                                            handlePriceChange(
                                                                                index,
                                                                                'reviewPointText',
                                                                                value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={12}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">포토/동영상 리뷰 작성</Text>
                                                                    <InputNumber
                                                                        value={
                                                                            price.reviewPointPhoto
                                                                                ? price.reviewPointPhoto
                                                                                : 50
                                                                        }
                                                                        style={{ width: '100%' }}
                                                                        onChange={(value) =>
                                                                            handlePriceChange(
                                                                                index,
                                                                                'reviewPointPhoto',
                                                                                value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={12}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">
                                                                        한달사용 텍스트 리뷰 작성
                                                                    </Text>
                                                                    <InputNumber
                                                                        value={
                                                                            price.reviewPointTextMonth
                                                                                ? price.reviewPointTextMonth
                                                                                : 10
                                                                        }
                                                                        style={{ width: '100%' }}
                                                                        onChange={(value) =>
                                                                            handlePriceChange(
                                                                                index,
                                                                                'reviewPointTextMonth',
                                                                                value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={12}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">
                                                                        한달사용 포토/동영상 리뷰 작성
                                                                    </Text>
                                                                    <InputNumber
                                                                        value={
                                                                            price.reviewPointPhotoMonth
                                                                                ? price.reviewPointPhotoMonth
                                                                                : 50
                                                                        }
                                                                        style={{ width: '100%' }}
                                                                        onChange={(value) =>
                                                                            handlePriceChange(
                                                                                index,
                                                                                'reviewPointPhotoMonth',
                                                                                value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
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
                    </Affix>
                </Col>
            </Row>
        </div>
    );
};

export default ProductPriceCardSteps;
