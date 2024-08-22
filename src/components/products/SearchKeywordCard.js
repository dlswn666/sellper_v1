import { Card, Image, Space, Row, Col, Divider } from 'antd';
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import InputComponent from '../InputComponent';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';
import '../../css/cardData.css';

const SearchKeywordCard = forwardRef(({ data, isFocused, onCardFocus }, ref) => {
    const imageSrc = data.images && data.images.length > 0 ? data.images[0] : defaultImage;
    const inputRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focusInput: () => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        },
    }));

    useEffect(() => {
        console.log(isFocused);
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <Space direction="vertical" size="middle" style={{ display: 'block', width: '100%' }}>
            <Row>
                <Col span={24}>
                    <Card hoverable style={{ width: '100%' }} onFocus={onCardFocus} tabIndex={0}>
                        <Image.PreviewGroup
                            items={data.images && data.images.length > 0 ? data.images : [defaultImage]}
                        >
                            <div style={{ display: 'flex', flex: 1 }}>
                                <Image width={150} src={imageSrc} fallback={defaultImage} alt="Product Image" />
                                <div style={{ marginLeft: 16, flex: 1 }}>
                                    <Row className="table-row" gutter={[4, 1]}>
                                        <Col span={5}>
                                            <p className="data-title">상품 이름 </p>
                                        </Col>
                                        <Col span={1}>
                                            <p className="data-title">:</p>
                                        </Col>
                                        <Col span={6}>
                                            <p className="data-content">{data.productTitle}</p>
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
                                            <p className="data-content">{data.productNumber}</p>
                                        </Col>
                                    </Row>
                                    <Divider className="divider" />
                                    <Row className="table-row" gutter={[4, 1]}>
                                        <Col span={5}>
                                            <p className="data-title">판매 가격</p>
                                        </Col>
                                        <Col span={1}>
                                            <p className="data-title">:</p>
                                        </Col>
                                        <Col span={4}>
                                            <p className="data-content">{data.price}</p>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Image.PreviewGroup>
                        <div style={{ marginTop: 16 }}>
                            <InputComponent ref={inputRef} placeholder="상품 검색어를 입력해주세요" />
                        </div>
                    </Card>
                </Col>
            </Row>
        </Space>
    );
});

export default SearchKeywordCard;
