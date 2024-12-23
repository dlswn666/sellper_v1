import { Col, Empty, Row, Space } from 'antd';
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
        <>
            <Row>
                <Col span={24}>
                    <Search
                        placeholder="상품 검색어를 입력해 주세요"
                        enterButton="Search"
                        size="large"
                        loading={searchLoading}
                    />
                </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: '10px' }}>
                <Col span={12} className="getter-row">
                    <p style={{ fontSize: '20px', textAlign: 'right' }}>
                        {' '}
                        상품수: {searchData && searchData.length ? searchData.length : 0}
                    </p>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: '10px' }}>
                <Col span={12}>
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
                </Col>
                <Col span={12}>
                    <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                        <div className="reco-word-container">{styledRecoProductName}</div>
                    </Space>
                </Col>
            </Row>
        </>
    );
};

export default ProductNameCardSteps;
