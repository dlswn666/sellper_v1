import React, { forwardRef, useEffect, useState, useRef } from 'react';
import { Card, Row, Col, Divider, Image, Button, message } from 'antd';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';
import '../../css/ImagePreview.css';
import { deleteProduct as deleteProductApi } from '../../apis/productsApi.js';

const ProductOptionPriceCard = forwardRef(({ data, index, isFocused, onCardFocus, onDelete }, ref) => {
    const cardRef = useRef(null);
    const [localData, setLocalData] = useState(data);
    const [thumbNailUrl, setThumbNailUrl] = useState([]);
    const imageSrc = data.thumbnail?.[0]?.thumbNailUrl || defaultImage;

    useEffect(() => {
        setLocalData(data);
        let finalSalePrice = data.productPrice - data.discountCharge;
        data.finalSalePrice = finalSalePrice;
        let optionValueJoin = '';
        // 모든 옵션 이름 조인
        data.optionProduct.forEach((option, index) => {
            if (index === data.optionProduct.length - 1) {
                optionValueJoin += `${option.optionValue} : ${parseInt(option.optionPrice)}`;
            } else {
                optionValueJoin += `${option.optionValue} : ${parseInt(option.optionPrice)}\r\n`;
            }
        });
        data.optionValueJoin = optionValueJoin;
        data.optionName = data.optionProduct[0].optionName;
        const urls = data.thumbnail?.map((item) => item.thumbNailUrl) || [];
        setThumbNailUrl(urls);
    }, [data, data.thumbnail]);

    useEffect(() => {
        if (isFocused && cardRef.current) {
            cardRef.current.focus();
        }
    }, [isFocused]);

    const formatKRW = (number) => {
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleDeleteProduct = async () => {
        try {
            const result = await deleteProductApi({
                productId: data.productId,
            });

            if (result.success) {
                message.success('상품이 성공적으로 삭제되었습니다.');
                onDelete(data.productId);
            } else {
                message.error('상품 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('상품 삭제 중 오류 발생:', error);
        }
    };

    return (
        <Card
            hoverable
            onClick={() => onCardFocus()}
            ref={cardRef}
            style={{
                width: '100%',
                border: isFocused ? '2px solid #1890ff' : '1px solid #d9d9d9',
            }}
            title={`${index}번 상품 ${data.pposProductId ? '옵션 적용' : '옵션 미적용'}`}
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
                                <p className="data-title">옵션명</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">{data.optionName}</p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">옵션값</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {data.optionValueJoin?.split('\r\n').map((value, index) => (
                                        <p key={index}>{value}</p>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">할인 금액</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">{formatKRW(data.discountCharge)}원</p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">최종 판매 가격</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">{formatKRW(data.finalSalePrice)}원</p>
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

export default ProductOptionPriceCard;
