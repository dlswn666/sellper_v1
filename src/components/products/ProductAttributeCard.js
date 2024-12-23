import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { Card, Row, Col, Divider, Space, Image, Input, Checkbox, Select, Button, Carousel, InputNumber } from 'antd';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';
import '../../css/ProductAttributeCard.css';

const formatKRW = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const ProductNotificationCard = forwardRef(({ data, isFocused, onCardFocus, attributeValues, attributes }, ref) => {
    const cardRef = useRef(null);
    const carouselRef = useRef(null);
    const [thumbNailUrl, setThumbNailUrl] = useState([]);
    const imageSrc = data.thumbnail?.[0]?.thumbNailUrl || defaultImage;
    const [originArea, setOriginArea] = useState('');

    useEffect(() => {
        const urls = data.thumbnail?.map((item) => item.thumbNailUrl) || [];
        setThumbNailUrl(urls);
        console.log('data', data);
    }, [data, data.thumbnail]);

    useImperativeHandle(ref, () => ({
        focusInput: () => {
            cardRef.current?.focus();
        },
    }));

    const handleFocus = () => {
        onCardFocus();
    };

    const renderAttributeField = (attributes, attributeValues) => {
        return attributes.map((attribute, index) => {
            if (attribute.attributeClassificationType === 'MULTI_SELECT') {
                const options =
                    attributeValues[attribute.attributeSeq]?.map((value) => ({
                        label: value.minAttributeValue,
                        value: value.attributeValueSeq,
                    })) || [];

                return (
                    <div key={attribute.attributeId} className="attribute-field">
                        <p className="data-title">
                            {index + 1}.{attribute.attributeName}
                        </p>
                        <Row gutter={[8, 8]}>
                            {options.map((option, index) => (
                                <Col span={5} key={option.value}>
                                    <Checkbox value={option.value}>{option.label}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </div>
                );
            } else if (attribute.attributeClassificationType === 'SINGLE_SELECT') {
                const options =
                    attributeValues[attribute.attributeSeq]?.map((value) => ({
                        label: value.minAttributeValue,
                        value: value.attributeValueSeq,
                    })) || [];

                return (
                    <div key={attribute.attributeId} className="attribute-field">
                        <p className="data-title">
                            {index + 1}.{attribute.attributeName}
                        </p>
                        <Select
                            style={{ width: '100%' }}
                            placeholder={`${attribute.attributeName} 선택`}
                            options={options}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                );
            }
            return null;
        });
    };

    return (
        <Card
            ref={cardRef}
            hoverable
            size="small"
            tabIndex={0}
            onFocus={handleFocus}
            className="product-card"
            style={{
                width: '100%',
                border: isFocused ? '2px solid #1890ff' : '1px solid #d9d9d9',
            }}
            actions={[
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '16px' }}>
                    <Button type="primary" onClick={() => carouselRef.current.next()}>
                        속성 저장
                    </Button>
                </div>,
            ]}
        >
            <Carousel ref={carouselRef} dots={false}>
                {/* 첫 번째 슬라이드: 상품 정보 */}
                <div className="product-info-slide">
                    <div className="product-content">
                        <Image.PreviewGroup items={thumbNailUrl.length > 0 ? thumbNailUrl : [defaultImage]}>
                            <div className="product-header">
                                <Image width={150} src={imageSrc} fallback={defaultImage} alt="Product Image" />
                                <div className="product-details">
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
                                    <Divider className="divider" />
                                    <Row className="table-row" gutter={[4, 1]}>
                                        <Col span={5}>
                                            <p className="data-title">판매 가격</p>
                                        </Col>
                                        <Col span={1}>
                                            <p className="data-title">:</p>
                                        </Col>
                                        <Col span={6}>
                                            <p className="data-content">{formatKRW(data.productPrice)}원</p>
                                        </Col>
                                        <Col span={5}>
                                            <p className="data-title">검색어</p>
                                        </Col>
                                        <Col span={1}>
                                            <p className="data-title">:</p>
                                        </Col>
                                        <Col span={6}>
                                            <p className="data-content">{data.searchWord}</p>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Image.PreviewGroup>
                    </div>
                    <div className="action-buttons">
                        <Button type="primary" onClick={() => carouselRef.current.next()}>
                            속성 작성하기
                        </Button>
                    </div>
                </div>

                {/* 두 번째 슬라이드: 속성 입력 */}
                <div className="attribute-slide">
                    <div className="attribute-content">
                        <>
                            <div className="attribute-container-title">
                                <p className="data-title">속성 입력</p>
                            </div>
                            {renderAttributeField(attributes, attributeValues)}
                            <Divider className="divider" />
                            <div className="attribute-container-title">
                                <p className="data-title">원산지 입력</p>
                            </div>
                            <Row className="table-row" gutter={[4, 1]}>
                                <Col span={6}>
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="국산/수입산 선택"
                                        options={[
                                            { label: '국산', value: 'domestic' },
                                            { label: '수입산', value: 'imported' },
                                        ]}
                                    />
                                </Col>
                                <Col span={10}>
                                    <Input placeholder="생산지 입력" onChange={(e) => setOriginArea(e.target.value)} />
                                </Col>
                            </Row>
                        </>
                    </div>
                    <div className="action-buttons">
                        <Button type="primary" onClick={() => carouselRef.current.prev()}>
                            상품 정보 보기
                        </Button>
                    </div>
                </div>
            </Carousel>
        </Card>
    );
});

export default ProductNotificationCard;
