import { Affix, Card, Col, Empty, Row, Space, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ProductNameCard from './ProductNameCard.js';
import Search from 'antd/es/input/Search.js';
import useInfiniteScroll from '../../hooks/useInfiniteScroll.js';
import { getAutoReco, putProductName } from '../../apis/productsApi.js';
import '../../css/productNameCard.css';

const ProductNameCardSteps = () => {
    const [hasMore, setHasMore] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [recoProductName, setRecoProductName] = useState([]);

    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);

    const [prevIndex, setPrevIndex] = useState(null);
    const [productNameFocusedIndex, setProductNameFocusedIndex] = useState(0);
    const productNameCardRefs = useRef([]);

    useEffect(() => {
        onSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            onSearch(searchTerm, true);
        }
    }, [page]);

    const onSearch = async (value = searchTerm, isLoadMore = false) => {
        if (searchLoading) return;

        let limit = 100;

        setSearchLoading(true);
        try {
            const response = await getAutoReco(value, isLoadMore ? page : 1, limit, 'proName');
            const result = response;
            if (!isLoadMore) {
                setSearchData(result);
                // setSearchKeywordFocusedIndex(0);
            } else {
                setSearchData((prevData) => [...prevData, ...result]);
            }
            if (result && searchData) {
                if (result.length < limit || searchData.length + result.length >= result[0].total_count) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            setHasMore(false);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    const handleProductNameKeyDown = (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
            setProductNameFocusedIndex((prevIndex) => {
                const newIndex = Math.min(prevIndex + 1, searchData.length - 1);
                productNameCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        } else if (e.key === 'ArrowUp') {
            setProductNameFocusedIndex((prevIndex) => {
                const newIndex = Math.max(prevIndex - 1, 0);
                productNameCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        }
    };

    const onFocusProductNameCard = (index) => {
        if (prevIndex !== null && productNameCardRefs.current[prevIndex]) {
            const prevValue = productNameCardRefs.current[prevIndex].getInputValue();
            if (prevValue) {
                let paramData = {
                    ...searchData[prevIndex],
                    productName: prevValue,
                };
                reqPutProductName(paramData);
                searchData[prevIndex].productName = prevValue;
                message.success('상품명이 성공적으로 변경되었습니다.');
            }
        }
        setPrevIndex(index);
        setProductNameFocusedIndex(index);

        if (searchData[index]) {
            setRecoProductName(searchData[index].recoProductNm.split(','));
        }
    };

    const reqPutProductName = async (data) => {
        return await putProductName(data);
    };

    const handleRemoveWord = (index) => {
        setRecoProductName((prevWords) => prevWords.filter((_, i) => i !== index));
    };

    const onWordClick = (index, word) => {
        if (productNameCardRefs.current[index]) {
            productNameCardRefs.current[index].setInputValue(word); // 선택한 단어를 해당 카드의 input에 설정
        }
    };

    // 스타일링과 클릭 핸들러를 적용하여 단어를 렌더링
    const styledRecoProductName = recoProductName.map((word, index) => (
        <span key={index} className="reco-word" onClick={() => onWordClick(productNameFocusedIndex, word)}>
            {word.trim()}
            <span
                onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveWord(index);
                }}
                className="remove-icon"
            >
                ×
            </span>
        </span>
    ));

    return (
        <div style={{ padding: '24px' }}>
            <Row style={{ marginBottom: '16px' }}>
                <Col span={24}>
                    <Search
                        placeholder="상품 검색어를 입력해 주세요"
                        enterButton="Search"
                        size="large"
                        loading={searchLoading}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title={`작업 상품 목록 (${searchData.length}개)`}>
                        <Space
                            direction="vertical"
                            size="middle"
                            style={{ display: 'flex', width: '100%' }}
                            onKeyDown={handleProductNameKeyDown}
                            tabIndex={0}
                        >
                            {searchData && searchData.length > 0 ? (
                                searchData.map((item, index) => (
                                    <ProductNameCard
                                        key={index}
                                        data={item}
                                        isFocused={index === productNameFocusedIndex}
                                        ref={(el) => (productNameCardRefs.current[index] = el)}
                                        onCardFocus={() => onFocusProductNameCard(index)}
                                    />
                                ))
                            ) : (
                                <Empty />
                            )}
                        </Space>
                    </Card>
                </Col>
                <Col span={12}>
                    <Affix offsetTop={100}>
                        <Card title="추천 상품명">
                            <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                                <div className="reco-word-container">{styledRecoProductName}</div>
                            </Space>
                        </Card>
                    </Affix>
                </Col>
            </Row>
        </div>
    );
};

export default ProductNameCardSteps;
