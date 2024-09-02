import { Card, Space, Row, Col, Divider } from 'antd';
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import '../../css/cardData.css';

const SelectWSProductCard = forwardRef(({ data, isFocused, onCardFocus, onClick, isSelected }, ref) => {
    const inputRef = useRef(null);
    // const [inputInitSw, setInputInitSw] = useState(null);

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

    // 포커스 아웃 또는 Enter 키 입력 시 실행될 함수
    // const handleInputAction = async (e) => {
    //     console.log('확인');
    // };

    // const getSearchWordData = async (data) => {
    //     const swData = await searchWordData(data);
    //     return swData;
    // };

    // 선택된 카드에 스타일을 동적으로 적용
    const cardStyle = {
        width: '100%',
        border: isSelected ? '2px solid #1890ff' : 'none', // 선택된 경우 파란색 border
        boxShadow: isSelected ? '0 4px 8px rgba(0, 0, 255, 0.2)' : 'none', // 선택된 경우 약간의 그림자 효과
    };

    return (
        <>
            <Space direction="vertical" size="middle" style={{ display: 'block', width: '100%' }}>
                <Row>
                    <Col span={24}>
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
                    </Col>
                </Row>
            </Space>
        </>
    );
});

export default SelectWSProductCard;
