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
import { debounce } from 'lodash';

const { Text } = Typography;

const ProductPriceCardSteps = ({ visible, onClose, onSave, initialData, platformData, mode = 'page' }) => {
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
    const [reSearchData, setReSearchData] = useState(false);
    const [failedPage, setFailedPage] = useState(1);
    const isLoadMore = useRef(false);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    useEffect(() => {
        if (mode === 'modal' && initialData) {
            console.log('initialData****************************', initialData);
            onSearch(initialData.productId);
            setProductPriceFocusedIndex(0);
        } else {
            onSearch();
        }
    }, [mode, initialData]);

    useEffect(() => {
        if (searchData?.length > 0 && !isLoadMore.current) {
            console.log('searchData****************************', searchData);
            productPriceCardRefs.current[0]?.focusInput();
            onFocusProductPriceCard(0);
        }
    }, [searchData]);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            isLoadMore.current = true;
            onSearch('', searchTerm, true);
            console.log('page', page);
        }
    }, [page]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        setHasMore(true);
        setSearchData([]);
        setPage(1);
        onSearch('', value);
    };

    const onSearch = async (productId = '', search = searchTerm, isLoadMore = false) => {
        if (searchLoading) return;
        setSearchLoading(true);
        let limit = 10;

        const currentPage = isLoadMore ? page : reSearchData ? failedPage : 1;

        try {
            const result = await getProductPriceData(productId, search, currentPage, limit);
            console.log('result', result);
            // 조회 후 개별 가격 조회
            for (const item of result) {
                const platformPrices = await fetchPlatformPrices(item.workingProductId);
                item.platformPrices = platformPrices;
            }
            const totalCount = result[0].total_count;

            if (!isLoadMore && !reSearchData) {
                setSearchData(result);
                setProductPriceFocusedIndex(0);
            } else {
                setSearchData((prev) => [...prev, ...result]);
            }

            const currentTotal = isLoadMore ? searchData.length + result.length : result.length;
            setHasMore(currentTotal < totalCount);
            setReSearchData(false);
            setFailedPage(1);
        } catch (error) {
            console.error('Error fetching data:', error);
            setHasMore(false);
            setReSearchData(true);
            setFailedPage(currentPage);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    const renderReSearchData = () => {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    marginTop: '16px',
                }}
            >
                <p>페이지 {failedPage}에서 데이터 로딩에 실패했습니다.</p>
                <Button type="primary" onClick={() => onSearch()} loading={searchLoading}>
                    실패한 페이지부터 다시 불러오기
                </Button>
            </div>
        );
    };

    const fetchPlatformPrices = async (productId) => {
        try {
            const result = await getPlatformPriceById(productId);
            console.log('result', result);
            result.forEach((price) => {
                // 판매가를 100원 단위로 올림 처리
                price.finalPrice = price.salePrice - price.discountPrice;
                price.discountPercent = Math.round((price.discountPrice / price.salePrice) * 100);

                price.marginPercent = Math.round(price.marginPercent * 100);
                price.platformPercent = Math.round(price.platformPercent * 100);
                price.taxPercent = Math.round(price.taxPercent * 100);
                price.finalProfitPrice =
                    price.salePrice -
                    price.discountPrice -
                    price.taxPrice -
                    price.platformPrice -
                    Number(price.wholesaleProductPrice);
                price.requiredDailySales =
                    dailyProfitTarget > 0 ? Math.ceil(dailyProfitTarget / price.finalProfitPrice) : 0;
                //price.naverProductPoint 존재 여부 확인
                if (price.platformId === 'naver' && price.naverProductPoint.length > 0) {
                    price.reviewPointText = price.naverProductPoint[0].reviewPointText;
                    price.reviewPointPhoto = price.naverProductPoint[0].reviewPointPhoto;
                    price.reviewPointTextMonth = price.naverProductPoint[0].reviewPointTextMonth;
                    price.reviewPointPhotoMonth = price.naverProductPoint[0].reviewPointPhotoMonth;
                } else {
                    price.reviewPointText = 10;
                    price.reviewPointPhoto = 50;
                    price.reviewPointTextMonth = 10;
                    price.reviewPointPhotoMonth = 50;
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

        // searchData[index]가 존재하고 platformPrices 배열이 있는지 확인
        if (searchData[index]?.platformPrices?.length > 0) {
            const selectedPlatformPrice = searchData[index].platformPrices[0];

            // naver 관련 데이터 처리 전에 platformId 확인
            if (selectedPlatformPrice.platformId === 'naver' && selectedPlatformPrice.naverProductPoint?.[0]) {
                selectedPlatformPrice.reviewPointText = selectedPlatformPrice.naverProductPoint[0].reviewPointText;
                selectedPlatformPrice.reviewPointPhoto = selectedPlatformPrice.naverProductPoint[0].reviewPointPhoto;
                selectedPlatformPrice.reviewPointTextMonth =
                    selectedPlatformPrice.naverProductPoint[0].reviewPointTextMonth;
                selectedPlatformPrice.reviewPointPhotoMonth =
                    selectedPlatformPrice.naverProductPoint[0].reviewPointPhotoMonth;
            }

            setPlatformPrices([selectedPlatformPrice]);
            setTimeout(() => {
                salePriceInputRef.current?.focus();
            }, 100);
        } else {
            // platformPrices가 없는 경우 빈 배열 설정
            setPlatformPrices([]);
        }
    };

    const debouncedCalculate = useRef(
        debounce((price, field, value, callback) => {
            // 판매가를 100원 단위로 올림 처리
            if (field === 'salePrice') {
                price.salePrice = Math.ceil(value / 100) * 100;
            }

            // 1. 할인가 계산
            if (field === 'discountPercent') {
                price.discountPrice = Math.ceil(price.salePrice * (value / 100));
            } else if (field === 'discountPrice') {
                price.discountPercent = Math.round((value / price.salePrice) * 100);
            } else {
                price.discountPrice = Math.ceil(price.salePrice * (price.discountPercent / 100));
                price.discountPercent = Math.round((price.discountPrice / price.salePrice) * 100);
            }

            // 2. 최종 판매금액 계산
            price.finalPrice = price.salePrice - price.discountPrice;
            setFinalPlatformPrices(price.finalPrice);

            // 3. 세금액 계산
            price.taxPrice = Math.ceil(price.finalPrice * (price.taxPercent / 100));

            // 4. 플랫폼 수수료액 계산
            price.platformPrice = Math.ceil(price.finalPrice * (price.platformPercent / 100));

            // 5. 마진액 계산
            price.marginPrice =
                price.finalPrice - price.taxPrice - price.platformPrice - Number(price.wholesaleProductPrice);

            // 6. 순이익 계산
            price.finalProfitPrice = Math.round(price.marginPrice);

            // 7. 마진율 계산
            price.marginPercent = Math.round((price.marginPrice / price.finalPrice) * 100);

            // 8. 목표 달성을 위한 일일 필요 판매량 계산
            price.requiredDailySales =
                dailyProfitTarget > 0 ? Math.ceil(dailyProfitTarget / price.finalProfitPrice) : 0;

            callback(price);
        }, 1000)
    ).current;

    const handlePriceChange = (index, field, value) => {
        let newPlatformPrices = [...platformPrices];
        newPlatformPrices[index] = {
            ...newPlatformPrices[index],
            [field]: value,
        };

        // 판매가가 0일 경우 즉시 모든 값 초기화
        if (value === 0 && field === 'salePrice') {
            newPlatformPrices[index] = {
                ...newPlatformPrices[index],
                discountPrice: 0,
                discountPercent: 0,
                finalPrice: 0,
                taxPrice: 0,
                platformPrice: 0,
                marginPrice: 0,
                finalProfitPrice: 0,
                marginPercent: 0,
                requiredDailySales: 0,
            };
            setPlatformPrices(newPlatformPrices);
            return;
        }

        // debounce된 계산 실행
        debouncedCalculate(newPlatformPrices[index], field, value, (calculatedPrice) => {
            newPlatformPrices[index] = calculatedPrice;
            setPlatformPrices([...newPlatformPrices]);
        });

        // 즉시 입력값 반영
        setPlatformPrices(newPlatformPrices);
    };

    // 컴포넌트 언마운트 시 debounce 취소
    useEffect(() => {
        return () => {
            debouncedCalculate.cancel();
        };
    }, []);

    const handleSave = async () => {
        isLoadMore.current = true;
        if (mode === 'page' && (prevIndex === null || !productPriceCardRefs.current[prevIndex])) return;
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

                // 현재 선택된 상품의 플랫폼 가격 정보만 업데이트
                const platformPrices = await fetchPlatformPrices(searchData[productPriceFocusedIndex].workingProductId);

                // 현재 searchData 배열 복사
                const newSearchData = [...searchData];

                // 현재 선택된 상품의 플랫폼 가격 정보만 업데이트
                newSearchData[productPriceFocusedIndex] = {
                    ...newSearchData[productPriceFocusedIndex],
                    platformPrices,
                };

                // 상태 업데이트
                setSearchData(newSearchData);
                setPlatformPrices(platformPrices);
                setTimeout(() => {
                    isLoadMore.current = false;
                }, 100);
            } else {
                message.error('가격 정보 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('저장 중 오류 발생:', error);
            message.error('가격 정보 저장에 실패했습니다.');
        }
    };

    // 숫자 포맷팅 함수
    const formatKRW = (number) => {
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // 가격 설정 정보 컨텐츠를 컴포넌트 내부 함수로 이동
    const renderPriceSettingContent = () => {
        return (
            <div
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
                                            style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '16px' }}
                                        >
                                            <Button
                                                type="primary"
                                                icon={<SaveOutlined />}
                                                size="small"
                                                style={{ width: '100px', height: '40px' }}
                                                onClick={() => handleSave()}
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
                                                                handlePriceChange(index, 'taxPercent', e.target.value)
                                                            }
                                                            suffix="%"
                                                        />
                                                    </div>
                                                    <div className="price-input-group">
                                                        <Text type="secondary">세금액</Text>
                                                        <Input value={formatKRW(price.taxPrice)} disabled suffix="원" />
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
                                                                const newPrices = platformPrices.map((price) => ({
                                                                    ...price,
                                                                    requiredDailySales:
                                                                        Number(numericValue) > 0
                                                                            ? Math.ceil(
                                                                                  Number(numericValue) /
                                                                                      price.finalProfitPrice
                                                                              )
                                                                            : 0,
                                                                }));
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
                                                            value={price.reviewPointText}
                                                            style={{ width: '100%' }}
                                                            onChange={(value) =>
                                                                handlePriceChange(index, 'reviewPointText', value)
                                                            }
                                                        />
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <div className="price-input-group">
                                                        <Text type="secondary">포토/동영상 리뷰 작성</Text>
                                                        <InputNumber
                                                            value={price.reviewPointPhoto ? price.reviewPointPhoto : 50}
                                                            style={{ width: '100%' }}
                                                            onChange={(value) =>
                                                                handlePriceChange(index, 'reviewPointPhoto', value)
                                                            }
                                                        />
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <div className="price-input-group">
                                                        <Text type="secondary">한달사용 텍스트 리뷰 작성</Text>
                                                        <InputNumber
                                                            value={
                                                                price.reviewPointTextMonth
                                                                    ? price.reviewPointTextMonth
                                                                    : 10
                                                            }
                                                            style={{ width: '100%' }}
                                                            onChange={(value) =>
                                                                handlePriceChange(index, 'reviewPointTextMonth', value)
                                                            }
                                                        />
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <div className="price-input-group">
                                                        <Text type="secondary">한달사용 포토/동영상 리뷰 작성</Text>
                                                        <InputNumber
                                                            value={
                                                                price.reviewPointPhotoMonth
                                                                    ? price.reviewPointPhotoMonth
                                                                    : 50
                                                            }
                                                            style={{ width: '100%' }}
                                                            onChange={(value) =>
                                                                handlePriceChange(index, 'reviewPointPhotoMonth', value)
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
            </div>
        );
    };

    return (
        <div style={{ padding: mode === 'modal' ? '0' : '24px' }}>
            {mode === 'page' && (
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
            )}

            <Row gutter={16}>
                {mode === 'page' && (
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
                            {reSearchData && renderReSearchData()}
                        </Card>
                    </Col>
                )}

                <Col span={mode === 'modal' ? 24 : 12}>
                    {mode === 'page' ? (
                        <Affix offsetTop={24}>
                            <Card title="가격 설정 정보">{renderPriceSettingContent()}</Card>
                        </Affix>
                    ) : (
                        <Card title="가격 설정 정보">{renderPriceSettingContent()}</Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ProductPriceCardSteps;
