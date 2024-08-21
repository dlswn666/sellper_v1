import { Card, Image, Space, Row, Col } from 'antd';
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import InputComponent from '../InputComponent';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';

const ProductTagCard = forwardRef(({ data, isFocused, onCardFocus }, ref) => {
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

    const fnOnBlur = () => {
        console.log('데이터 저장');
    };

    return (
        <Space direction="vertical" size="middle" style={{ display: 'block', width: '100%' }}>
            <Row>
                <Col span={12}>
                    <Card hoverable style={{ width: '100%' }} onFocus={onCardFocus} tabIndex={0}>
                        <Image.PreviewGroup
                            items={data.images && data.images.length > 0 ? data.images : [defaultImage]}
                        >
                            <div style={{ display: 'flex', flex: 1 }}>
                                <Image width={150} src={imageSrc} fallback={defaultImage} alt="Product Image" />
                                <div style={{ marginLeft: 16, flex: 1 }}>
                                    <Row gutter={[4, 1]}>
                                        <Col span={4}>
                                            <p style={{ fontSize: 16, fontWeight: 'bold' }}>상품 이름 :</p>
                                        </Col>
                                        <Col span={20}>
                                            <p style={{ fontSize: 14 }}>{data.productTitle}</p>
                                        </Col>
                                    </Row>
                                    <Row gutter={[4, 1]}>
                                        <Col span={4}>
                                            <p style={{ fontSize: 16, fontWeight: 'bold' }}>판매 사이트 Tag :</p>
                                        </Col>
                                        <Col span={4}>
                                            <p style={{ fontSize: 14 }}>{data.siteName}</p>
                                        </Col>
                                        <Col span={4}>
                                            <p style={{ fontSize: 16, fontWeight: 'bold' }}>상품 번호 :</p>
                                        </Col>
                                        <Col span={4}>
                                            <p style={{ fontSize: 14 }}>{data.productNumber}</p>
                                        </Col>
                                    </Row>
                                    <Row gutter={[4, 1]}>
                                        <Col span={4}>
                                            <p style={{ fontSize: 16, fontWeight: 'bold' }}>판매 가격 :</p>
                                        </Col>
                                        <Col span={4}>
                                            <p style={{ fontSize: 14 }}>{data.price}</p>
                                        </Col>
                                        <Col span={4}>
                                            <p style={{ fontSize: 16, fontWeight: 'bold' }}>설정 검색어 :</p>
                                        </Col>
                                        <Col span={4}>
                                            <p style={{ fontSize: 14 }}>{data.productNumber}</p>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Image.PreviewGroup>
                        <div style={{ marginTop: 16 }}>
                            <InputComponent ref={inputRef} placeholder="상품 키워드를 입력해주세요" onBlur={fnOnBlur} />
                        </div>
                    </Card>
                </Col>
                <Col span={12}></Col>
            </Row>
        </Space>
    );
});

export default ProductTagCard;
