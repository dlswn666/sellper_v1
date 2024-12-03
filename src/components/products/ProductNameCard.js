import { Card, Image, Space, Row, Col, Divider } from 'antd';
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import InputComponent from '../InputComponent.js';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';

const ProductNameCard = forwardRef(({ data, isFocused, onCardFocus }, ref) => {
    const [thumbNailUrl, setThumbNailUrl] = useState([]);
    const imageSrc = data.thumbnail && data.thumbnail.length > 0 ? data.thumbnail[0].thumbNailUrl : defaultImage;
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState('');

    useImperativeHandle(ref, () => ({
        focusInput: () => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        },
        getInputValue: () => inputValue,
        setInputValue: (value) => {
            setInputValue((prevValue) => `${prevValue} ${value}`.trim()); // 기존 값에 새 단어 추가
        },
    }));

    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    useEffect(() => {
        if (data.thumbnail && Array.isArray(data.thumbnail)) {
            const urls = data.thumbnail.map((item) => item.thumbNailUrl);
            setThumbNailUrl(urls);
        }
    }, [data.thumbnail]);

    return (
        <Space direction="vertical" size="middle" style={{ display: 'block', width: '100%' }}>
            <Row>
                <Col span={24}>
                    <Card hoverable style={{ width: '100%' }} onFocus={onCardFocus} tabIndex={0}>
                        <Image.PreviewGroup items={thumbNailUrl.length > 0 ? thumbNailUrl : [defaultImage]}>
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
                                    <Row className="table-row" gutter={[4, 1]}>
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
                                            <p className="data-title">설정 검색어 :</p>
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
                        <div style={{ marginTop: 16 }}>
                            <InputComponent
                                ref={inputRef}
                                placeholder="상품명을 입력해주세요"
                                value={inputValue} // value를 상태로 관리하여 전달
                                onChange={(e) => setInputValue(e.target.value)} // 상태 업데이트
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </Space>
    );
});

export default ProductNameCard;
