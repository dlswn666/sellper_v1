import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { Card, Row, Col, Divider, Space, Image, InputNumber, Checkbox, Select } from 'antd';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';
import '../../css/ProductAttributeCard.css';
const formatKRW = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const ProductNotificationCard = forwardRef(({ data, isFocused, onCardFocus, attributeValues, attributes }, ref) => {
    const cardRef = useRef(null);
    const [thumbNailUrl, setThumbNailUrl] = useState([]);
    const [isFlipped, setIsFlipped] = useState(false);
    const imageSrc = data.thumbnail && data.thumbnail.length > 0 ? data.thumbnail[0].thumbNailUrl : defaultImage;

    const handleCardClick = (e) => {
        setIsFlipped(!isFlipped);
        onCardFocus(e);
    };

    useImperativeHandle(ref, () => ({
        focusInput: () => {
            cardRef.current.focus();
        },
    }));

    const renderAttributeField = (attribute, attributeValues) => {
        if (attribute.attributeClassificationType === 'MULTI_SELECT') {
            const options =
                attributeValues[attribute.attributeSeq]?.map((value) => ({
                    label: value.minAttributeValue,
                    value: value.attributeValueSeq,
                })) || [];
            return (
                <div key={attribute.attributeId} style={{ marginBottom: 16 }}>
                    <h3 style={{ marginBottom: 8 }}>{attribute.attributeName}</h3>
                    <Checkbox.Group
                        style={{ width: '100%' }}
                        options={options}
                        placeholder={`${attribute.minAttributeValue} 선택`}
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
                <div key={attribute.attributeId} style={{ marginBottom: 16 }}>
                    <h3 style={{ marginBottom: 8 }}>{attribute.attributeName}</h3>
                    <Select placeholder={`${attribute.attributeName} 선택`} options={options} />
                </div>
            );
        }
    };

    return (
        <div className="card-container">
            <div className={`card-flipper ${isFlipped ? 'flipped' : ''}`}>
                {/* 앞면 */}
                <div className="card-front">
                    <Card
                        ref={cardRef}
                        hoverable
                        size="small"
                        onClick={handleCardClick}
                        tabIndex={0}
                        style={{
                            width: '100%',
                            border: isFocused ? '2px solid #1890ff' : '1px solid #d9d9d9',
                        }}
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
                                                    value={data.productPrice}
                                                    style={{
                                                        width: '150px',
                                                        color: '#000',
                                                        backgroundColor: '#f0f0f0',
                                                    }}
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
                </div>

                {/* 뒷면 */}
                <div className="card-back">
                    <Card
                        size="small"
                        onClick={handleCardClick}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: '2px solid #1890ff',
                        }}
                    >
                        <div style={{ padding: '20px' }}>
                            <h2 style={{ marginBottom: 16 }}>상품 속성</h2>
                            {attributes.map((attribute) => renderAttributeField(attribute, attributeValues))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
});

export default ProductNotificationCard;
