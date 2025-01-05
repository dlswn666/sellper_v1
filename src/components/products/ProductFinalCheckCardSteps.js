import React, { useState, useEffect, useRef } from 'react';
import { getFinalProductData } from '../../apis/productsApi.js';
import { Row, Col, Card, Empty, Space, Affix, Image, Button, Divider, Typography, Input } from 'antd';
import ProductFinalCheckCard from './ProductFinalCheckCard.js';
import Search from 'antd/es/input/Search.js';

const { Text } = Typography;

const { REACT_APP_BASE_URL } = process.env;

const ProductFinalCheckCardSteps = () => {
    const [finalProductData, setFinalProductData] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(100);
    const [productFocusedIndex, setProductFocusedIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);
    const [thumbnailUrl, setThumbnailUrl] = useState([]);
    const [deletedThumbnail, setDeletedThumbnail] = useState([]);
    const [detailProduct, setDetailProduct] = useState({});
    const [titleProductName, setTitleProductName] = useState('');
    const [productCategory, setProductCategory] = useState({});
    const [platformProductPrice, setPlatformProductPrice] = useState({});
    const [platformProductOption, setPlatformProductOption] = useState({});
    const [platformProductNaverPoint, setPlatformProductNaverPoint] = useState({});
    const [platformProductDeliveryInfo, setPlatformProductDeliveryInfo] = useState({});
    const [platformProductAttribute, setPlatformProductAttribute] = useState({});
    const productCardRefs = useRef([]);

    useEffect(() => {
        onSearch();
    }, []);

    useEffect(() => {
        if (finalProductData.length > 0) {
            initialFocusProductCard();
        }
    }, [finalProductData]);

    const initialFocusProductCard = () => {
        setTimeout(() => {
            productCardRefs.current[0]?.focus();
            onFocusProductCard(0);
        }, 100);
    };

    const onSearch = async (productId = '', value = searchTerm, isLoadMore = false) => {
        if (searchLoading) return;
        setSearchLoading(true);
        try {
            const response = await getFinalProductData({
                limit,
                page: hasMore ? page : 1,
                productId,
                searchTerm: value,
            });
            const result = response || [];

            if (!isLoadMore) {
                setFinalProductData(result);
            } else {
                setFinalProductData((prev) => [...prev, ...result]);
            }
            setHasMore(result.length >= 100);
        } catch (error) {
            console.error('Error fetching final product data:', error);
            setHasMore(false);
        } finally {
            setSearchLoading(false);
        }
    };

    // 카테고리 포맷팅
    const formatCategory = (categories) => {
        // 카테고리가 없거나 빈 배열인 경우
        if (!categories || categories.length === 0) return '';

        // 첫 번째 카테고리 항목 사용
        const firstCategory = categories[0];

        // 객체인 경우 (네이버 형식)
        if (typeof firstCategory === 'object' && !Array.isArray(firstCategory)) {
            const values = [];
            // category_no1 부터 category_no4 까지 확인
            for (let i = 1; i <= 4; i++) {
                const value = firstCategory[`category_no${i}`];
                if (value) values.push(value);
            }
            return values.join(' > ');
        }

        // 배열인 경우
        if (Array.isArray(firstCategory)) {
            return firstCategory.join(' > ');
        }

        // 문자열인 경우
        return String(firstCategory || '');
    };

    const onFocusProductCard = (index) => {
        if (index === prevIndex && thumbnailUrl.length > 0) return;

        setPrevIndex(index);
        setProductFocusedIndex(index);
        setDetailProduct(finalProductData[index]);
        setTitleProductName(finalProductData[index]?.productName);

        const productCat = finalProductData[index]?.productCategory || {};
        console.log(finalProductData[index]);

        const formattedCategories = {
            naverCategory: formatCategory(productCat.naver || []),
            coupangCategory: formatCategory(productCat.coupang || []),
            elevenstCategory: formatCategory(productCat.elevenst || []),
            gmarketCategory: formatCategory(productCat.gmarket || []),
        };

        let platformProductPrice = finalProductData[index]?.platformProductPrice || {};

        platformProductPrice = {
            naver: platformProductPrice.naver[0] || null,
            coupang: platformProductPrice.coupang[0] || null,
            elevenst: platformProductPrice.elevenst[0] || null,
            gmarket: platformProductPrice.gmarket[0] || null,
        };

        const productOptions = finalProductData[index]?.platformProductOption || {
            all: [],
            naver: [],
            coupang: [],
            elevenst: [],
            gmarket: [],
        };

        setPlatformProductOption({
            all: productOptions.all || [],
            naver: productOptions.naver || [],
            coupang: productOptions.coupang || [],
            elevenst: productOptions.elevenst || [],
            gmarket: productOptions.gmarket || [],
        });

        const platformProductAttribute = finalProductData[index]?.platformProductAttribute || {};

        setPlatformProductAttribute({
            naver: platformProductAttribute.naver || [],
            coupang: platformProductAttribute.coupang || [],
            elevenst: platformProductAttribute.elevenst || [],
            gmarket: platformProductAttribute.gmarket || [],
        });

        setPlatformProductNaverPoint(finalProductData[index]?.platformProductNaverPoint[0]);
        setPlatformProductDeliveryInfo(finalProductData[index]?.platformProductDeliveryInfo[0]);

        setProductCategory(formattedCategories);
        setPlatformProductPrice(platformProductPrice);
    };

    const onDeleteThumbnail = (thumbnailItem) => {
        const newThumbnailUrl = thumbnailUrl.filter((item) => item !== thumbnailItem);
        // 삭제된 썸네일 정보 저장
        const deletedThumbnail = thumbnailUrl.find((item) => item === thumbnailItem);
        setDeletedThumbnail(deletedThumbnail);
        setThumbnailUrl(newThumbnailUrl);
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
                        onSearch={onSearch}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={9}>
                    <Card title={`작업 상품 목록 (${finalProductData.length}개)`}>
                        <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                            {finalProductData?.length > 0 ? (
                                finalProductData.map((item, index) => (
                                    <ProductFinalCheckCard
                                        key={item.productId}
                                        data={item}
                                        isFocused={productFocusedIndex === index}
                                        onCardFocus={() => onFocusProductCard(index)}
                                        ref={(el) => (productCardRefs.current[index] = el)}
                                    />
                                ))
                            ) : (
                                <Empty description="상품이 없습니다." />
                            )}
                        </Space>
                    </Card>
                </Col>
                <Col span={15}>
                    <Affix offsetTop={24}>
                        <Card title="상품 상세 정보">
                            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                <Card title={`상품 : ${titleProductName}`}>
                                    <Row>
                                        <Col span={24}>
                                            <div className="data-title">썸네일</div>
                                            <div className="data-content">
                                                {thumbnailUrl.length > 0 ? (
                                                    thumbnailUrl.map((item) => (
                                                        <div
                                                            style={{
                                                                margin: '10px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                flexDirection: 'column',
                                                            }}
                                                            key={item}
                                                        >
                                                            <Image
                                                                width={150}
                                                                src={item}
                                                                alt="Product Image"
                                                                onError={(e) => {
                                                                    console.error('Image load error for:', item);
                                                                    e.target.src = '/default-image.png'; // 기본 이미지 경로 설정
                                                                }}
                                                                fallback="/default-image.png" // Antd Image 컴포넌트의 기본 fallback 이미지
                                                            />
                                                            <Button
                                                                type="primary"
                                                                danger
                                                                style={{ marginTop: '10px' }}
                                                                onClick={() => onDeleteThumbnail(item)}
                                                            >
                                                                삭제
                                                            </Button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>썸네일이 없습니다.</div>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Divider className="divider" />
                                    <Row>
                                        <Col span={24}>
                                            <div className="data-input-container">
                                                <Text type="secondary">상품명</Text>
                                                <Input
                                                    value={detailProduct?.productName}
                                                    onChange={(e) => {
                                                        setDetailProduct((prev) => ({
                                                            ...prev,
                                                            productName: e.target.value,
                                                        }));
                                                    }}
                                                    showCount
                                                    maxLength={100}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Divider className="divider" />
                                    <Row>
                                        <Col span={24}>
                                            <div className="data-input-container">
                                                <Text type="secondary">
                                                    상품 태그 ({detailProduct?.platformTag?.split(' ').length}개 / 최대
                                                    10개)
                                                </Text>
                                                <Input
                                                    value={detailProduct?.platformTag
                                                        ?.split(' ')
                                                        .map((tag) => (tag ? `#${tag} ` : ''))
                                                        .join(' ')}
                                                    readOnly
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Divider className="divider" />
                                    <Row>
                                        <Col span={24}>
                                            <Card title="카테고리">
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {productCategory?.naverCategory && (
                                                        <div className="category-item">
                                                            <Text strong>네이버: </Text>
                                                            <Text>{productCategory?.naverCategory || '-'}</Text>
                                                        </div>
                                                    )}
                                                    {productCategory?.coupangCategory && (
                                                        <div className="category-item">
                                                            <Text strong>쿠팡: </Text>
                                                            <Text>{productCategory?.coupangCategory || '-'}</Text>
                                                        </div>
                                                    )}
                                                    {productCategory?.elevenstCategory && (
                                                        <div className="category-item">
                                                            <Text strong>11번가: </Text>
                                                            <Text>{productCategory?.elevenstCategory || '-'}</Text>
                                                        </div>
                                                    )}
                                                    {productCategory?.gmarketCategory && (
                                                        <div className="category-item">
                                                            <Text strong>지마켓: </Text>
                                                            <Text>{productCategory?.gmarketCategory || '-'}</Text>
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Divider className="divider" />
                                    <h3>상품 가격</h3>
                                    <Row>
                                        <Col span={24}>
                                            {platformProductPrice?.naver && (
                                                <Card title="네이버">
                                                    <Row gutter={[16, 16]}>
                                                        <Col span={6}>
                                                            <div className="data-input-container">
                                                                <Text type="secondary">상품 가격</Text>
                                                                <Input
                                                                    value={platformProductPrice?.naver?.price}
                                                                    readOnly
                                                                    addonAfter="원"
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col span={6}>
                                                            <div className="data-input-container">
                                                                <Text type="secondary">세금</Text>
                                                                <Input
                                                                    value={platformProductPrice?.naver?.taxPrice}
                                                                    readOnly
                                                                    addonAfter="원"
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col span={6}>
                                                            <div className="data-input-container">
                                                                <Text type="secondary">플랫폼 수수료</Text>
                                                                <Input
                                                                    value={platformProductPrice?.naver?.platformPrice}
                                                                    readOnly
                                                                    addonAfter="원"
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col span={6}>
                                                            <div className="data-input-container">
                                                                <Text type="secondary">마진금액</Text>
                                                                <Input
                                                                    value={platformProductPrice?.naver?.marginPrice}
                                                                    readOnly
                                                                    addonAfter="원"
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            )}
                                            {platformProductPrice?.coupang && (
                                                <Card title="쿠팡">
                                                    <div className="data-input-container">
                                                        <Text type="secondary">상품 가격</Text>
                                                        <Input
                                                            value={platformProductPrice?.coupang?.platformPrice}
                                                            readOnly
                                                        />
                                                    </div>
                                                </Card>
                                            )}
                                            {platformProductPrice?.elevenst && (
                                                <Card title="11번가">
                                                    <div className="data-input-container">
                                                        <Text type="secondary">상품 가격</Text>
                                                        <Input
                                                            value={platformProductPrice?.elevenst?.platformPrice}
                                                            readOnly
                                                        />
                                                    </div>
                                                </Card>
                                            )}
                                            {platformProductPrice?.gmarket && (
                                                <Card title="G마켓">
                                                    <div className="data-input-container">
                                                        <Text type="secondary">상품 가격</Text>
                                                        <Input
                                                            value={platformProductPrice?.gmarket?.platformPrice}
                                                            readOnly
                                                        />
                                                    </div>
                                                </Card>
                                            )}
                                        </Col>
                                    </Row>
                                    <Divider className="divider" />
                                    <h3>상품 옵션</h3>
                                    <Row>
                                        <Col span={24}>
                                            {platformProductOption?.all && platformProductOption?.all.length > 0 && (
                                                <Card title="전체" style={{ marginTop: '16px' }}>
                                                    {platformProductOption?.all?.map((item, index) => (
                                                        <Row key={`all-${item.optionName}-${index}`} gutter={[16, 16]}>
                                                            <Col span={8}>
                                                                <div className="data-input-container">
                                                                    <Text type="secondary">옵션 이름</Text>
                                                                    <Input value={item.optionName} readOnly />
                                                                </div>
                                                            </Col>
                                                            <Col span={8}>
                                                                <div className="data-input-container">
                                                                    <Text type="secondary">옵션 값</Text>
                                                                    <Input value={item.optionValue} readOnly />
                                                                </div>
                                                            </Col>
                                                            <Col span={8}>
                                                                <div className="data-input-container">
                                                                    <Text type="secondary">옵션 가격</Text>
                                                                    <Input value={item.optionPrice} readOnly />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </Card>
                                            )}
                                            {platformProductOption?.naver &&
                                                platformProductOption?.naver.length > 0 && (
                                                    <Card title="네이버" style={{ marginTop: '16px' }}>
                                                        {platformProductOption?.naver?.map((item, index) => (
                                                            <Row
                                                                key={`naver-${item.optionName}-${index}`}
                                                                gutter={[16, 16]}
                                                            >
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">옵션 이름</Text>
                                                                        <Input value={item.optionName} readOnly />
                                                                    </div>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">옵션 값</Text>
                                                                        <Input value={item.optionValue} readOnly />
                                                                    </div>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">옵션 가격</Text>
                                                                        <Input value={item.optionPrice} readOnly />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        ))}
                                                    </Card>
                                                )}
                                            {platformProductOption?.coupang &&
                                                platformProductOption?.coupang.length > 0 && (
                                                    <Card title="쿠팡" style={{ marginTop: '16px' }}>
                                                        {platformProductOption?.coupang?.map((item, index) => (
                                                            <Row
                                                                key={`coupang-${item.optionName}-${index}`}
                                                                gutter={[16, 16]}
                                                            >
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">옵션 이름</Text>
                                                                        <Input value={item.optionName} readOnly />
                                                                    </div>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">옵션 값</Text>
                                                                        <Input value={item.optionValue} readOnly />
                                                                    </div>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">옵션 가격</Text>
                                                                        <Input value={item.optionPrice} readOnly />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        ))}
                                                    </Card>
                                                )}
                                            {platformProductOption?.elevenst &&
                                                platformProductOption?.elevenst.length > 0 && (
                                                    <Card title="11번가" style={{ marginTop: '16px' }}>
                                                        {platformProductOption?.elevenst?.map((item, index) => (
                                                            <Row
                                                                key={`elevenst-${item.optionName}-${index}`}
                                                                gutter={[16, 16]}
                                                            >
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">옵션 이름</Text>
                                                                        <Input value={item.optionName} readOnly />
                                                                    </div>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">옵션 값</Text>
                                                                        <Input value={item.optionValue} readOnly />
                                                                    </div>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">옵션 가격</Text>
                                                                        <Input value={item.optionPrice} readOnly />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        ))}
                                                    </Card>
                                                )}
                                            {platformProductOption?.gmarket &&
                                                platformProductOption?.gmarket.length > 0 && (
                                                    <Card title="G마켓" style={{ marginTop: '16px' }}>
                                                        {platformProductOption?.gmarket?.map((item, index) => (
                                                            <Row
                                                                key={`gmarket-${item.optionName}-${index}`}
                                                                gutter={[16, 16]}
                                                            >
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">옵션 이름</Text>
                                                                        <Input value={item.optionName} readOnly />
                                                                    </div>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">옵션 값</Text>
                                                                        <Input value={item.optionValue} readOnly />
                                                                    </div>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">옵션 가격</Text>
                                                                        <Input value={item.optionPrice} readOnly />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        ))}
                                                    </Card>
                                                )}
                                        </Col>
                                    </Row>
                                    <Divider className="divider" />
                                    <h3>리뷰 포인트</h3>
                                    <Card title="네이버">
                                        <Row gutter={[16, 16]}>
                                            <Col span={6}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">텍스트 리뷰 포인트</Text>
                                                    <Input
                                                        value={platformProductNaverPoint?.textReviewPoint}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">한달 사용 후 텍스트 리뷰 포인트</Text>
                                                    <Input
                                                        value={platformProductNaverPoint?.monthTextReviewPoint}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">동영상/사진 리뷰 포인트</Text>
                                                    <Input
                                                        value={platformProductNaverPoint?.videoReviewPoint}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">한달 사용 후 동영상/사진 리뷰 포인트</Text>
                                                    <Input
                                                        value={platformProductNaverPoint?.monthVideoReviewPoint}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <Divider className="divider" />
                                    <h3>배송정보</h3>
                                    <Card title="네이버">
                                        <Row gutter={[16, 16]}>
                                            <Col span={16}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">출고지</Text>
                                                    <Input
                                                        value={platformProductDeliveryInfo?.dispatchLocation}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">택배사</Text>
                                                    <Input
                                                        value={platformProductDeliveryInfo?.deliveryCompanyName}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={[16, 16]}>
                                            <Col span={16}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">반품지</Text>
                                                    <Input
                                                        value={platformProductDeliveryInfo?.returnDeliveryLocation}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">택배사</Text>
                                                    <Input
                                                        value={platformProductDeliveryInfo?.returnDeliveryCompanyName}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={[16, 16]}>
                                            <Col span={6}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">배송 유형</Text>
                                                    <Input
                                                        value={platformProductDeliveryInfo?.deliveryAttTypeName}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">배송비 유형</Text>
                                                    <Input
                                                        value={platformProductDeliveryInfo?.deliveryFeeTypeName}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">배송비 결재 타입</Text>
                                                    <Input
                                                        value={platformProductDeliveryInfo?.deliveryPayTypeName}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">배송 방법</Text>
                                                    <Input
                                                        value={platformProductDeliveryInfo?.deliveryTypeName}
                                                        readOnly
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={[16, 16]}>
                                            <Col span={6}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">기본 배송비</Text>
                                                    <Input
                                                        value={platformProductDeliveryInfo?.deliveryBaseFee}
                                                        readOnly
                                                        addonAfter="원"
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">제주 및 도서 산간 추가 배송비</Text>
                                                    <Input
                                                        value={platformProductDeliveryInfo?.extraDeliveryFee}
                                                        readOnly
                                                        addonAfter="원"
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">무료 배송 최소 구매 금액</Text>
                                                    <Input
                                                        value={platformProductDeliveryInfo?.freeConditionAmount}
                                                        readOnly
                                                        addonAfter="원"
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div className="data-input-container">
                                                    <Text type="secondary">반품 배송비</Text>
                                                    <Input
                                                        value={platformProductDeliveryInfo?.returnDeliveryFee}
                                                        readOnly
                                                        addonAfter="원"
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <Divider className="divider" />
                                    <h3>상품 속성</h3>
                                    {platformProductAttribute?.naver && (
                                        <Card title="네이버">
                                            {platformProductAttribute?.naver?.originArea && (
                                                <Card title="원산지">
                                                    {platformProductAttribute?.naver?.originArea.map((item, index) => (
                                                        <Row key={`naver-origin-area-${index}`} gutter={[16, 16]}>
                                                            <Col span={12}>
                                                                <div className="data-input-container">
                                                                    <Text type="secondary">수입/수출</Text>
                                                                    <Input
                                                                        value={
                                                                            item.originNation === 'imported'
                                                                                ? '수입산'
                                                                                : '국내산'
                                                                        }
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={12}>
                                                                <div className="data-input-container">
                                                                    <Text type="secondary">원산지</Text>
                                                                    <Input value={item.originArea} readOnly />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </Card>
                                            )}
                                            {platformProductAttribute?.naver?.certificationList && (
                                                <Card title="인증" style={{ marginTop: '16px' }}>
                                                    {platformProductAttribute?.naver?.certificationList.map(
                                                        (item, index) => (
                                                            <Row key={`naver-certification-${index}`} gutter={[16, 16]}>
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">인증명</Text>
                                                                        <Input value={item.certInfoName} readOnly />
                                                                    </div>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">인증기관</Text>
                                                                        <Input value={item.agency} readOnly />
                                                                    </div>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">인증번호</Text>
                                                                        <Input value={item.number} readOnly />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    )}
                                                </Card>
                                            )}
                                            {platformProductAttribute?.naver?.selectedAttributes && (
                                                <Card title="속성" style={{ marginTop: '16px' }}>
                                                    {platformProductAttribute?.naver?.selectedAttributes.map(
                                                        (item, index) => (
                                                            <Row key={`naver-attribute-${index}`} gutter={[16, 16]}>
                                                                <Col span={12}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">속성명</Text>
                                                                        <Input value={item.attributeName} readOnly />
                                                                    </div>
                                                                </Col>
                                                                <Col span={12}>
                                                                    <div className="data-input-container">
                                                                        <Text type="secondary">속성값</Text>
                                                                        <Input
                                                                            value={item.minAttributeValue}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    )}
                                                </Card>
                                            )}
                                        </Card>
                                    )}
                                </Card>
                            </div>
                        </Card>
                    </Affix>
                </Col>
            </Row>
        </div>
    );
};

export default ProductFinalCheckCardSteps;
