import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Card, Row, Col, Image, Divider } from 'antd';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ProductFinalCheckCard = forwardRef(({ data, isFocused, onCardFocus }, ref) => {
    const cardRef = useRef(null);
    const [localData, setLocalData] = useState(data);
    const imageSrc = data.productThumbnail?.[0]?.imgPath || defaultImage;
    const [thumbNailUrl, setThumbNailUrl] = useState([]);

    useEffect(() => {
        const urls = data.productThumbnail?.map((item) => REACT_APP_BASE_URL + item.imgPath) || [];
        setThumbNailUrl(urls);
    }, [data]);

    useEffect(() => {
        if (isFocused && cardRef.current) {
            cardRef.current.focus();
        }
    }, [isFocused]);

    return (
        <Card
            hoverable
            onClick={() => onCardFocus()}
            ref={cardRef}
            tabIndex={0}
            style={{
                width: '100%',
                border: isFocused ? '2px solid #1890ff' : '1px solid #d9d9d9',
            }}
        >
            <Image.PreviewGroup items={thumbNailUrl}>
                <div style={{ display: 'flex', flex: 1 }}>
                    <Image
                        width={150}
                        src={REACT_APP_BASE_URL + imageSrc}
                        fallback={defaultImage}
                        alt="Product Image"
                    />
                    <div style={{ marginLeft: 16, flex: 1 }}>
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">상품 이름</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">{data.productName}</p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">상품 가격</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">{data.productPrice}</p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">도매 사이트</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">{data.siteName}</p>
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
                    </div>
                </div>
            </Image.PreviewGroup>
        </Card>
    );
});

export default ProductFinalCheckCard;
