import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Card, Image, Space, Row, Col, Divider, Tag, InputNumber } from 'antd';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';

const ProductPriceCard = forwardRef(({ data, isFocused, onCardFocus, onPriceChange }, ref) => {
    const [localData, setLocalData] = useState(data);
    const cardRef = useRef(null);
    const [thumbNailUrl, setThumbNailUrl] = useState([]);
    const imageSrc = data.thumbnail && data.thumbnail.length > 0 ? data.thumbnail[0].thumbNailUrl : defaultImage;
    const [price, setPrice] = useState(Number(data.wholeProductPrice.replace(/[^0-9]/g, '')));

    useEffect(() => {
        setLocalData(data);
        const urls = data.thumbnail?.map((item) => item.thumbNailUrl) || [];
        setThumbNailUrl(urls);
    }, [data]);

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

    const handlePriceChange = (value) => {
        setPrice(value);
        if (onPriceChange) {
            onPriceChange(value);
        }
    };

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
                                <p className="data-content">{data.wholeProductPrice}</p>
                            </Col>
                            <Col span={5}>
                                <p className="data-title">설정 검색어</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={6}>
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
                                        onChange={handlePriceChange}
                                        style={{ width: '150px' }}
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
