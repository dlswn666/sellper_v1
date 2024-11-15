import React, { forwardRef } from 'react';
import { Row, Col, Divider, InputNumber } from 'antd';

const ProductPriceCard = forwardRef(({ data, isFocused, onCardFocus }, ref) => {
    return (
        <div className={`price-card ${isFocused ? 'focused' : ''}`} onClick={onCardFocus} ref={ref}>
            <Row>
                <Col span={5}>
                    <p className="data-title">상품 코드</p>
                </Col>
                <Col span={1}>
                    <p className="data-title">:</p>
                </Col>
                <Col span={18}>
                    <p className="data-content">{data.productCode}</p>
                </Col>
            </Row>
            <Divider className="divider" />
            <Row>
                <Col span={5}>
                    <p className="data-title">현재 가격</p>
                </Col>
                <Col span={1}>
                    <p className="data-title">:</p>
                </Col>
                <Col span={18}>
                    <p className="data-content">{data.currentPrice}</p>
                </Col>
            </Row>
            <Divider className="divider" />
            <Row>
                <Col span={5}>
                    <p className="data-title">새 가격 설정</p>
                </Col>
                <Col span={1}>
                    <p className="data-title">:</p>
                </Col>
                <Col span={18}>
                    <InputNumber
                        min={0}
                        defaultValue={data.currentPrice}
                        formatter={(value) => `${value} 원`}
                        parser={(value) => value.replace(' 원', '')}
                    />
                </Col>
            </Row>
        </div>
    );
});

export default ProductPriceCard;
