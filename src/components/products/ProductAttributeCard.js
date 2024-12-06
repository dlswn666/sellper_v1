import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Card, Row, Col, Divider, Space, Image, InputNumber, Checkbox, Select, Button, Carousel } from 'antd';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';
import '../../css/ProductAttributeCard.css';

const formatKRW = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const ProductNotificationCard = forwardRef(({ data, isFocused, onCardFocus, attributeValues, attributes }, ref) => {
    const cardRef = useRef(null);
    const carouselRef = useRef(null);
    const imageSrc = data.thumbnail && data.thumbnail.length > 0 ? data.thumbnail[0].thumbNailUrl : defaultImage;

    useImperativeHandle(ref, () => ({
        focusInput: () => {
            cardRef.current?.focus();
        },
    }));

    const handleFocus = () => {
        onCardFocus();
    };

    const renderAttributeField = (attributes, attributeValues) => {
        return attributes.map((attribute) => {
            if (attribute.attributeClassificationType === 'MULTI_SELECT') {
                const options =
                    attributeValues[attribute.attributeSeq]?.map((value) => ({
                        label: value.minAttributeValue,
                        value: value.attributeValueSeq,
                    })) || [];

                return (
                    <div key={attribute.attributeId} className="attribute-field">
                        <h3>{attribute.attributeName}</h3>
                        <Checkbox.Group
                            options={options}
                            placeholder={`${attribute.minAttributeValue} 선택`}
                            onClick={(e) => e.stopPropagation()}
                        />
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
                        <h3>{attribute.attributeName}</h3>
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
        >
            <Carousel ref={carouselRef} dots={false}>
                {/* 첫 번째 슬라이드: 상품 정보 */}
                <div className="product-info-slide">
                    <div className="product-content">
                        <Image.PreviewGroup>
                            <div className="product-header">
                                <Image width={150} src={imageSrc} fallback={defaultImage} alt="Product Image" />
                                <div className="product-details">
                                    <Row className="info-row">
                                        <Col span={5}>
                                            <span className="label">상품 이름</span>
                                        </Col>
                                        <Col span={19}>
                                            <span className="value">{data.wholeProductName}</span>
                                        </Col>
                                    </Row>
                                    <Divider />
                                    <Row className="info-row">
                                        <Col span={5}>
                                            <span className="label">판매 사이트</span>
                                        </Col>
                                        <Col span={7}>
                                            <span className="value">{data.siteName}</span>
                                        </Col>
                                        <Col span={5}>
                                            <span className="label">상품 번호</span>
                                        </Col>
                                        <Col span={7}>
                                            <span className="value">{data.productCode}</span>
                                        </Col>
                                    </Row>
                                    <Divider />
                                    <Row className="info-row">
                                        <Col span={5}>
                                            <span className="label">판매 가격</span>
                                        </Col>
                                        <Col span={7}>
                                            <span className="value">{formatKRW(data.wholeProductPrice)}원</span>
                                        </Col>
                                        <Col span={5}>
                                            <span className="label">검색어</span>
                                        </Col>
                                        <Col span={7}>
                                            <span className="value">{data.searchWord}</span>
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
                    <div className="attribute-content">{renderAttributeField(attributes, attributeValues)}</div>
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
