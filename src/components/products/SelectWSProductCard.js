import { Card, Space, Row, Col, Divider } from 'antd';
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';
import '../../css/cardData.css';
import '../../css/ImagePreview.css';

const SelectWSProductCard = forwardRef(({ data, isFocused, onCardFocus, onClick, isSelected }, ref) => {
    const inputRef = useRef(null);
    const [thumbNailUrl, setThumbNailUrl] = useState([]);
    const imageSrc = data.thumbnail?.[0]?.thumbNailUrl || defaultImage;

    useImperativeHandle(ref, () => ({
        focusInput: () => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        },
    }));

    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    // 선택된 카드에 스타일을 동적으로 적용
    const cardStyle = {
        width: '100%',
        border: isSelected ? '2px solid #1890ff' : 'none', // 선택된 경우 파란색 border
        boxShadow: isSelected ? '0 4px 8px rgba(0, 0, 255, 0.2)' : 'none', // 선택된 경우 약간의 그림자 효과
    };

    return (
        <Card hoverable style={cardStyle} onFocus={onCardFocus} tabIndex={0} onClick={onClick}>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ marginLeft: 16, flex: 1 }}>
                    <Row className="table-row" gutter={[4, 1]}>
                        <Col span={5}>
                            <p className="data-title">상품 이름 </p>
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
                            <p className="data-content">{data.productPrice}</p>
                        </Col>
                        <Col span={5}>
                            <p className="data-title">작업 상품 수</p>
                        </Col>
                        <Col span={1}>
                            <p className="data-title">:</p>
                        </Col>
                        <Col span={6}>
                            <p className="data-content">{data.workingCnt} </p>
                        </Col>
                    </Row>
                </div>
            </div>
        </Card>
    );
});

export default SelectWSProductCard;
