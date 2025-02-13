import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Card, Image, Space, Row, Col, Divider, InputNumber } from 'antd';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';
import '../../css/ImagePreview.css';
const formatKRW = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const ProductPriceCard = forwardRef(({ data, index, isFocused, onCardFocus, onPriceChange }, ref) => {
    const [localData, setLocalData] = useState(data);
    const cardRef = useRef(null);
    const [thumbNailUrl, setThumbNailUrl] = useState([]);
    const imageSrc = data.thumbnail && data.thumbnail.length > 0 ? data.thumbnail[0].thumbNailUrl : defaultImage;
    const [price, setPrice] = useState(data.platformPrices?.[0]?.finalPrice || 0);

    useEffect(() => {
        setLocalData(data);
        const urls = data.thumbnail?.map((item) => item.thumbNailUrl) || [];
        setThumbNailUrl(urls);
        if (data.platformPrices?.[0]?.finalPrice) {
            setPrice(data.platformPrices[0].finalPrice);
        }
    }, [data, data.platformPrices]);

    useEffect(() => {
        if (isFocused && cardRef.current) {
            cardRef.current.focus();
        }
    }, [isFocused]);

    useImperativeHandle(ref, () => ({
        focusInput: () => {
            if (cardRef.current) {
                cardRef.current.focus();
            }
        },
        getNewPrice: () => price,
    }));

    return (
        <Card
            ref={cardRef}
            hoverable
            className="card-move-animation"
            style={{
                width: '100%',
                border: isFocused ? '2px solid #1890ff' : '1px solid #d9d9d9',
            }}
            onClick={onCardFocus}
            tabIndex={0}
            title={`${index}번 상품 - ${data.stage === 'OP' ? '판매가 설정' : '판매가 미설정'}`}
        >
            <Image.PreviewGroup items={thumbNailUrl.length > 0 ? thumbNailUrl : [defaultImage]}>
                <div style={{ display: 'flex', flex: 1 }}>
                    <Image width={150} src={imageSrc} fallback={defaultImage} alt="Product Image" />
                    <div style={{ marginLeft: 16, flex: 1 }}>
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">상품 이름</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">{data.wholeProductName}</p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">판매 사이트</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={6}>
                                <p className="data-content">{data.siteName}</p>
                            </Col>
                            <Col span={5}>
                                <p className="data-title">상품 번호</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={6}>
                                <p className="data-content">{data.productCode}</p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row>
                            <Col span={5}>
                                <p className="data-title">판매 가격</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={6}>
                                <p className="data-content">{formatKRW(data.wholeProductPrice)}</p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">상세 페이지</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">
                                    <a
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const screenWidth = window.screen.width;
                                            const screenHeight = window.screen.height;
                                            const windowWidth = 1200;
                                            const windowHeight = 800;
                                            const left = screenWidth - windowWidth;
                                            const top = 0;

                                            window.open(
                                                data.detailPageUrl,
                                                '_blank',
                                                `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`
                                            );
                                        }}
                                        href={data.detailPageUrl}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        상세페이지 이동
                                    </a>
                                </p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row>
                            <Col span={5}>
                                <p className="data-title">설정 검색어</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">{data.searchWord}</p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row>
                            <Col span={5}>
                                <p className="data-title">가공 상품 이름</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">{data.productName}</p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row>
                            <Col span={5}>
                                <p className="data-title">설정 태그</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">
                                    {data.platformTag
                                        ?.split(' ')
                                        .map((tag, index) => (tag ? `#${tag} ` : ''))
                                        .join(' ')}
                                </p>
                            </Col>
                        </Row>
                        {data.naverCategory && (
                            <>
                                <Divider className="divider" />
                                <Row className="table-row" gutter={[4, 1]}>
                                    <Col span={5}>
                                        <p className="data-title">네이버 카테고리</p>
                                    </Col>
                                    <Col span={1}>
                                        <p className="data-title">:</p>
                                    </Col>
                                    <Col span={18}>{data.naverCategory}</Col>
                                </Row>
                            </>
                        )}
                        {data.coupangCategory && (
                            <>
                                <Divider className="divider" />
                                <Row className="table-row" gutter={[4, 1]}>
                                    <Col span={5}>
                                        <p className="data-title">쿠팡 카테고리</p>
                                    </Col>
                                    <Col span={1}>
                                        <p className="data-title">:</p>
                                    </Col>
                                    <Col span={18}>{data.coupangCategory}</Col>
                                </Row>
                            </>
                        )}
                        {data.gmarketCategory && (
                            <>
                                <Divider className="divider" />
                                <Row className="table-row" gutter={[4, 1]}>
                                    <Col span={5}>
                                        <p className="data-title">G마켓 카테고리</p>
                                    </Col>
                                    <Col span={1}>
                                        <p className="data-title">:</p>
                                    </Col>
                                    <Col span={18}>{data.gmarketCategory}</Col>
                                </Row>
                            </>
                        )}
                        {data.elevenstCategory && (
                            <>
                                <Divider className="divider" />
                                <Row className="table-row" gutter={[4, 1]}>
                                    <Col span={5}>
                                        <p className="data-title">11번가 카테고리</p>
                                    </Col>
                                    <Col span={1}>
                                        <p className="data-title">:</p>
                                    </Col>
                                    <Col span={18}>{data.elevenstCategory}</Col>
                                </Row>
                            </>
                        )}
                        <Divider className="divider" />
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">가격 설정</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <Space>
                                    <InputNumber
                                        min={0}
                                        value={price}
                                        style={{ width: '150px', color: '#000', backgroundColor: '#f0f0f0' }}
                                        formatter={(value) => formatKRW(value)}
                                        parser={(value) => value.replace(/[^\d]/g, '')}
                                        disabled
                                    />
                                    <span>원</span>
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Image.PreviewGroup>
        </Card>
    );
});

ProductPriceCard.displayName = 'ProductPriceCard';

export default ProductPriceCard;
