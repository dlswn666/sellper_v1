import { Card, Image, Space, Row, Col, Divider, Input } from 'antd';
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';
import '../../css/cardData.css';
import { putSearchWord } from '../../apis/productsApi';

const SearchKeywordCard = forwardRef(({ data, isFocused, onCardFocus }, ref) => {
    const imageSrc = data.thumbnail && data.thumbnail.length > 0 ? data.thumbnail[0].thumbNailUrl : defaultImage;
    const inputRef = useRef(null);
    const [localData, setLocalData] = useState(structuredClone(data));
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

    const onKeyDown = async (e) => {
        if (e.key === 'Enter') {
            console.log(e.target.value);
            const curValue = e.target.value;
            const preValue = localData.searchWord ? localData.searchWord : '';
            const id = localData.workingProductId;

            const param = {
                id,
                curValue,
                preValue,
            };

            if (curValue.trim() !== preValue.trim()) {
                const result = await putSearchWord(param); // 비동기 함수이므로 await 사용
                if (result) {
                    // 검색어를 성공적으로 변경한 후 localData 업데이트
                    setLocalData((prevData) => ({
                        ...prevData,
                        searchWord: curValue, // searchWord 값 업데이트
                    }));
                    console.log('param 확인', param);
                }
            }
        }
    };

    // 추가된 onChange 핸들러
    // const handleInputChange = (e) => {
    //     setLocalData((prevData) => ({
    //         ...prevData,
    //         searchWord: e.target.value,
    //     }));
    // };

    return (
        <Space direction="vertical" size="middle" style={{ display: 'block', width: '100%' }}>
            <Row>
                <Col span={24}>
                    <Card hoverable style={{ width: '100%' }} onFocus={onCardFocus} tabIndex={0}>
                        <Image.PreviewGroup
                            items={localData.images && localData.images.length > 0 ? localData.images : [defaultImage]}
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
                                        <Col span={18}>
                                            <p className="data-content">{localData.productName}</p>
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
                                            <p className="data-content">{localData.siteName}</p>
                                        </Col>
                                        <Col span={5}>
                                            <p className="data-title">상품 번호</p>
                                        </Col>
                                        <Col span={1}>
                                            <p className="data-title">:</p>
                                        </Col>
                                        <Col span={6}>
                                            <p className="data-content">{localData.productCode}</p>
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
                                            <p className="data-content">{localData.productPrice} </p>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Image.PreviewGroup>
                        <div style={{ marginTop: 16 }}>
                            <Input
                                ref={inputRef}
                                onKeyDown={onKeyDown}
                                placeholder="상품 검색어를 입력해주세요"
                                defaultValue={localData.searchWord}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </Space>
    );
});

export default SearchKeywordCard;
