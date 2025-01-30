import { Card, Image, Row, Col, Divider, Button, message } from 'antd';
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import InputComponent from '../InputComponent.js';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';
import { putProductTag, postProductTag } from '../../apis/productsApi.js';
import '../../css/ImagePreview.css';

const ProductTagCard = forwardRef(({ data, index, isFocused, onCardFocus, tagInfo }, ref) => {
    const [thumbNailUrl, setThumbNailUrl] = useState([]);
    const imageSrc = data.thumbnail && data.thumbnail.length > 0 ? data.thumbnail[0].thumbNailUrl : defaultImage;
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [localData, setLocalData] = useState(structuredClone(data));
    const [tagCount, setTagCount] = useState(0);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (data.thumbnail && Array.isArray(data.thumbnail)) {
            const urls = data.thumbnail.map((item) => item.thumbNailUrl);
            setThumbNailUrl(urls);
        }
    }, [data.thumbnail]);

    useEffect(() => {
        if (tagInfo && tagInfo.code && Array.isArray(tags) && !tags.find((tag) => tag.code === tagInfo.code)) {
            setTags((prevTags) => [...prevTags, tagInfo]);
        }
    }, [tagInfo]);

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

    const handleSave = async () => {
        console.log('tags****************************', tags);
        const result = await putProductTag({ productId: data.productId, tag: tags });
        console.log('result****************************', result);
        if (result.success) {
            const tagTexts = tags.map((tag) => tag.text).join(' ');
            const paramsData = { productId: data.productId, tag: tagTexts };
            const result = await postProductTag(paramsData);
            console.log('result****************************', result);
            if (result.success) {
                message.success('태그가 저장되었습니다.');
            } else {
                message.error('태그 저장에 실패했습니다.');
            }
        } else {
            message.error('태그 저장에 실패했습니다.');
        }
    };

    const handleRemoveTag = (indexToRemove) => {
        setTags((prevTags) => prevTags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <Card
            hoverable
            style={{ border: isFocused ? '2px solid #1890ff' : '1px solid #d9d9d9' }}
            onFocus={onCardFocus}
            tabIndex={0}
            title={`${index}번 상품 - ${data.platformTag ? '태그 설정' : '태그 미설정'}`}
            actions={[
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '16px' }}>
                    <Button type="primary" onClick={handleSave}>
                        태그 저장
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
                                        <p className="data-content">{`#${data.platformTag.split(' ').join(' #')}`}</p>
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
                    <span style={{ color: tags.length > 0 ? '#1890ff' : '#999' }}>
                        {tags.length}개의 태그 / 최대 10개
                    </span>
                </div>
                <div
                    className="reco-word-container"
                    style={{ minHeight: '44px', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '6px' }}
                >
                    {tags.map((tag, index) => (
                        <span key={tag.code} className="reco-word">
                            {tag.text}
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveTag(index);
                                }}
                                className="remove-icon"
                            >
                                ×
                            </span>
                        </span>
                    ))}
                </div>
            </div>
        </Card>
    );
});

export default ProductTagCard;
