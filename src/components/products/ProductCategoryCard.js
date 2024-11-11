import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Card, Image, Space, Row, Col, Divider, Tag } from 'antd';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';

const ProductCategoryCard = forwardRef(({ data, isFocused, onCardFocus }, ref) => {
    console.log(data.thumbnail);
    const imageSrc = data.thumbnail && data.thumbnail.length > 0 ? data.thumbnail[0].thumbNailUrl : defaultImage;
    const [localData, setLocalData] = useState(data);
    const cardRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [thumbNailUrl, setThumbNailUrl] = useState([]);

    useEffect(() => {
        setLocalData(data);
        const urls = data.thumbnail.map((item) => item.thumbNailUrl);
        console.log(urls);
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
        getSelectedCategory: () => selectedCategory,
        setSelectedCategory: (category) => {
            setSelectedCategory(category);
        },
    }));

    const renderCurrentCategory = () => {
        if (!localData.cateNam) return null;

        try {
            const categories = JSON.parse(localData.cateNam);
            return categories.map((category, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                    <Space size={[0, 8]} wrap>
                        {Object.entries(category)
                            .filter(([key, value]) => value && key.startsWith('categoryNm'))
                            .map(([key, value], i) => (
                                <Tag key={i} color="blue">
                                    {value}
                                </Tag>
                            ))}
                    </Space>
                </div>
            ));
        } catch (error) {
            console.error('카테고리 파싱 에러:', error);
            return null;
        }
    };

    return (
        <Card
            ref={cardRef}
            hoverable
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
                        <Divider className="divider" />
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">현재 카테고리</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>{renderCurrentCategory()}</Col>
                        </Row>
                        {selectedCategory && (
                            <>
                                <Divider className="divider" />
                                <Row className="table-row" gutter={[4, 1]}>
                                    <Col span={5}>
                                        <p className="data-title">선택된 카테고리</p>
                                    </Col>
                                    <Col span={1}>
                                        <p className="data-title">:</p>
                                    </Col>
                                    <Col span={18}>
                                        <Tag color="green">{selectedCategory.title}</Tag>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </div>
                </div>
            </Image.PreviewGroup>
        </Card>
    );
});

ProductCategoryCard.displayName = 'ProductCategoryCard';

export default ProductCategoryCard;
