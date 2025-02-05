import { Card, Image, Row, Col, Divider, Button, message } from 'antd';
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import InputComponent from '../InputComponent.js';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';
import { putProductTag, postProductTag } from '../../apis/productsApi.js';
import '../../css/ImagePreview.css';

const ProductTagCard = forwardRef(({ data, index, isFocused, onCardFocus, onTagSave, mode = 'page' }, ref) => {
    const [thumbNailUrl, setThumbNailUrl] = useState([]);
    const [localData, setLocalData] = useState(structuredClone(data));
    const [tags, setTags] = useState([]);
    const inputRef = useRef(null); // input ref 유지

    // 초기 데이터 로드 시 태그 설정
    useEffect(() => {
        const safeData = data || {};
        if (Array.isArray(safeData?.tagInfo)) {
            // tagId와 productId를 제외한 새로운 태그 배열 생성
            const cleanTags = safeData.tagInfo
                .filter((tag) => tag && tag.code && tag.text)
                .map((tag) => ({
                    code: tag.code,
                    text: tag.text,
                }));
            console.log('cleanTags', cleanTags);
            setTags(cleanTags);
        } else if (safeData?.tagInfo && safeData?.tagInfo.code && safeData?.tagInfo.text) {
            // 단일 태그인 경우도 동일하게 처리
            const cleanTag = {
                code: safeData.tagInfo.code,
                text: safeData.tagInfo.text,
            };
            console.log('cleanTag1', cleanTag);
            setTags([cleanTag]);
        }
    }, [data]);

    // 포커스 처리
    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    useImperativeHandle(ref, () => ({
        focusInput: () => {
            inputRef.current?.focus();
        },
        addTag: (newTag) => {
            if (!newTag || !newTag.code || !newTag.text) {
                return;
            }

            setTags((prevTags) => {
                // 중복 체크
                const exists = prevTags.some((tag) => tag.code === newTag.code);

                if (!exists && prevTags.length < 10) {
                    console.log('prevTags', prevTags);
                    const newTags = [...prevTags, { code: newTag.code, text: newTag.text }];
                    console.log('newTags', newTags);
                    return newTags;
                }
                console.log('prevTags1', prevTags);
                return prevTags;
            });
        },
        getTags: () => tags,
        clearTags: () => setTags([]),
    }));

    // data가 없을 경우 기본값 설정
    const defaultData = {
        thumbnail: [],
        productName: '',
        platformTag: '',
        // 필요한 다른 기본값들 추가
    };

    useEffect(() => {
        console.log('tags', tags);
    }, [tags]);

    // data가 없을 경우 기본값 사용
    const safeData = data || defaultData;

    // thumbnail 안전하게 접근
    const thumbnailUrl =
        safeData.thumbnail && safeData.thumbnail.length > 0 ? safeData.thumbnail[0].thumbNailUrl : defaultImage;

    console.log(safeData.tagInfo);

    useEffect(() => {
        if (safeData.thumbnail && Array.isArray(safeData.thumbnail)) {
            const urls = safeData.thumbnail.map((item) => item.thumbNailUrl);
            setThumbNailUrl(urls);
        }
    }, [safeData.thumbnail]);

    // useEffect(() => {
    //     console.log('safeData.tagInfo', safeData.tagInfo);
    //     if (safeData.tagInfo && !tags.find((tag) => tag.code === safeData.tagInfo.code)) {
    //         console.log('safeData.tagInfo11', safeData.tagInfo);
    //         setTags((prevTags) => [...prevTags, safeData.tagInfo]);
    //     }
    // }, [safeData.tagInfo]);

    const handleSave = async () => {
        try {
            const result = await putProductTag({ productId: safeData.productId, tag: tags });
            if (result.success) {
                message.success('태그가 저장되었습니다.');
                console.log('typeof onTagSave', typeof onTagSave);
                if (typeof onTagSave === 'function') {
                    onTagSave(safeData.productId);
                }
            } else {
                message.error('태그 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error in handleSave:', error);
            message.error('태그 저장 중 오류가 발생했습니다.');
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
            title={`${index}번 상품 - ${safeData.platformTag ? '태그 설정' : '태그 미설정'}`}
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
                    <Image width={150} src={thumbnailUrl} fallback={defaultImage} alt="Product Image" />
                    <div style={{ marginLeft: 16, flex: 1 }}>
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">상품 이름 </p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">{safeData.wholeProductName}</p>
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
                                <p className="data-content">{safeData.siteName}</p>
                            </Col>
                            <Col span={5}>
                                <p className="data-title">상품 번호</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={6}>
                                <p className="data-content">{safeData.productCode}</p>
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
                                <p className="data-content">{safeData.wholeProductPrice}</p>
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
                                                safeData.detailpageUrl,
                                                '_blank',
                                                `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`
                                            );
                                        }}
                                        href={safeData.detailpageUrl}
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
                                <p className="data-content">{safeData.searchWord}</p>
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
                                <p className="data-content">{safeData.productName}</p>
                            </Col>
                        </Row>
                        {safeData.platformTag && (
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
                                        <p className="data-content">{`#${safeData.platformTag.split(' ').join(' #')}`}</p>
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
                    style={{
                        minHeight: '44px',
                        padding: '8px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                    }}
                >
                    {tags &&
                        tags.length > 0 &&
                        tags
                            .filter((tag) => tag && tag.text) // null이나 빈 태그 필터링
                            .map((tag, index) => (
                                <span
                                    key={`${tag.code}_${index}`}
                                    className="reco-word"
                                    style={{
                                        backgroundColor: '#f0f0f0',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}
                                >
                                    {tag.text}
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveTag(index);
                                        }}
                                        className="remove-icon"
                                        style={{
                                            cursor: 'pointer',
                                            marginLeft: '4px',
                                        }}
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
