import { Card, Image, Row, Col, Divider, Button, message } from 'antd';
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import InputComponent from '../InputComponent.js';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';
import { deleteProduct } from '../../apis/productsApi.js';

const ProductNameCard = forwardRef(({ data, index, isFocused, onCardFocus, onDelete }, ref) => {
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

    const handleDeleteProduct = async () => {
        try {
            console.log('data.productId', data.productId);
            const result = await deleteProduct({
                productId: data.productId,
            });

            if (result.success) {
                message.success('상품이 성공적으로 삭제되었습니다.');
                if (typeof onDelete === 'function') {
                    onDelete(data.productId);
                }
            } else {
                message.error('상품 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('상품 삭제 중 오류 발생:', error);
            message.error('상품 삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <Card
            hoverable
            onFocus={onCardFocus}
            tabIndex={0}
            style={{ border: isFocused ? '2px solid #1890ff' : '1px solid #d9d9d9' }}
            title={`${index}번 상품 - ${data.productName ? '상품명 설정' : '상품명 미설정'}`}
            actions={[
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '16px' }}>
                    <Button type="primary" danger onClick={handleDeleteProduct}>
                        삭제
                    </Button>
                </div>,
            ]}
        >
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
                                                data.detailpageUrl,
                                                '_blank',
                                                `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`
                                            );
                                        }}
                                        href={data.detailpageUrl}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        상세페이지 이동
                                    </a>
                                </p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">설정 검색어 </p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">{data.searchWord}</p>
                            </Col>
                        </Row>
                        {data.productName && (
                            <>
                                <Divider className="divider" />
                                <Row className="table-row" gutter={[4, 1]}>
                                    <Col span={5}>
                                        <p className="data-title">가공상품명 </p>
                                    </Col>
                                    <Col span={1}>
                                        <p className="data-title">:</p>
                                    </Col>
                                    <Col span={18}>
                                        <p className="data-content">{data.productName}</p>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </div>
                </div>
            </Image.PreviewGroup>
            <div style={{ marginTop: 16 }}>
                <InputComponent
                    ref={inputRef}
                    placeholder="상품명을 입력해주세요"
                    value={inputValue} // value를 상태로 관리하여 전달
                    onChange={(e) => setInputValue(e.target.value)} // 상태 업데이트
                    showCount={true}
                    maxLength={100}
                />
            </div>
        </Card>
    );
});

export default ProductNameCard;
