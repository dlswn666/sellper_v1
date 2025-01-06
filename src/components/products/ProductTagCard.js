import { Card, Image, Space, Row, Col, Divider } from 'antd';
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import InputComponent from '../InputComponent.js';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';
import { putProductTag } from '../../apis/productsApi.js';
import '../../css/ImagePreview.css';

const ProductTagCard = forwardRef(({ data, isFocused, onCardFocus }, ref) => {
    const [thumbNailUrl, setThumbNailUrl] = useState([]);
    const imageSrc = data.thumbnail && data.thumbnail.length > 0 ? data.thumbnail[0].thumbNailUrl : defaultImage;
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [localData, setLocalData] = useState(structuredClone(data));
    const [tagCount, setTagCount] = useState(0);

    useEffect(() => {
        console.log('tag data', data);
        if (data.thumbnail && Array.isArray(data.thumbnail)) {
            const urls = data.thumbnail.map((item) => item.thumbNailUrl);
            setThumbNailUrl(urls);
        }
    }, [data.thumbnail]);

    useEffect(() => {
        const tags = inputValue
            .trim()
            .split(' ')
            .filter((tag) => tag.length > 0);
        setTagCount(tags.length);
    }, [inputValue]);

    useImperativeHandle(ref, () => ({
        focusInput: () => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        },
        getInputValue: () => inputValue,
        setInputValue: (value) => {
            setInputValue((prevValue) => `${prevValue} ${value}`.trim());
        },
    }));

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
                                    <Divider className="divider" />
                                    <Row className="table-row" gutter={[4, 1]}>
                                        <Col span={5}>
                                            <p className="data-title">가공 상품 이름</p>
                                        </Col>
                                        <Col span={1}>
                                            <p className="data-title">:</p>
                                        </Col>
                                        <Col span={18}>
                                            <p className="data-content">{data.productName}</p>
                                        </Col>
                                    </Row>
                                    {data.platformTag && (
                                        <>
                                            <Divider className="divider" />
                                            <Row className="table-row" gutter={[4, 1]}>
                                                <Col span={5}>
                                                    <p className="data-title">태그</p>
                                                </Col>
                                                <Col span={1}>
                                                    <p className="data-title">:</p>
                                                </Col>
                                                <Col span={18}>
                                                    <p className="data-content">
                                                        {`#${data.platformTag.split(' ').join(' #')}`}
                                                    </p>
                                                </Col>
                                            </Row>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Image.PreviewGroup>
                        <div style={{ marginTop: 16 }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 8,
                                }}
                            >
                                <span>태그 입력</span>
                                <span style={{ color: tagCount > 0 ? '#1890ff' : '#999' }}>{tagCount}개의 태그</span>
                            </div>
                            <InputComponent
                                ref={inputRef}
                                placeholder="상품 태그를 입력해주세요"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </Space>
    );
});

export default ProductTagCard;
