import { Col, Empty, Row, Space } from 'antd';
import Search from 'antd/es/input/Search';
import { useEffect, useRef, useState } from 'react';
import { getAutoReco, putProductTag } from '../../apis/productsApi';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import ProductTagCard from './ProductTagCard';
import '../../css/productNameCard.css';

const ProductTagCardSteps = () => {
    const [hasMore, setHasMore] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [recoProductTag, setRecoProductTag] = useState([]);
    const [prevIndex, setPrevIndex] = useState(null);
    const [productTagFocusedIndex, setProductTagFocusedIndex] = useState(0);
    const productTagCardRefs = useRef([]);

    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);

    useEffect(() => {
        onSearch();
    }, []);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            onSearch(searchTerm, true);
        }
    }, [page]);

    useEffect(() => {
        if (searchData && searchData.length > 0) {
            productTagCardRefs.current[0]?.focusInput();
            onFocusProductTagCard(0);
        }
    }, [searchData]);

    const onSearch = async (value = searchTerm, isLoadMore = false) => {
        if (searchLoading) return;

        let limit = 100;
        setSearchLoading(true);

        try {
            const response = await getAutoReco(value, isLoadMore ? page : 1, limit, 'tag');
            const result = response;

            if (!isLoadMore) {
                setSearchData(result);
                setProductTagFocusedIndex(0);
            } else {
                setSearchData((prevData) => [...prevData, ...result]);
            }

            if (result && searchData) {
                if (result.length < limit || searchData.length + result.length >= result[0].total_count) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setHasMore(true);
        setSearchData([]);
        setPage(1);
        onSearch(value);
    };

    const handleProductTagKeyDown = (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
            setProductTagFocusedIndex((prevIndex) => {
                const newIndex = Math.min(prevIndex + 1, searchData.length - 1);
                productTagCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        } else if (e.key === 'ArrowUp') {
            setProductTagFocusedIndex((prevIndex) => {
                const newIndex = Math.max(prevIndex - 1, 0);
                productTagCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        }
    };

    const onFocusProductTagCard = (index) => {
        if (prevIndex !== null && productTagCardRefs.current[prevIndex]) {
            const prevValue = productTagCardRefs.current[prevIndex].getInputValue();
            if (prevValue && searchData[prevIndex]) {
                const paramData = {
                    productId: searchData[prevIndex].productId,
                    productTag: prevValue,
                };
                try {
                    putProductTag(paramData);
                } catch (error) {
                    console.error('태그 업데이트 중 오류 발생:', error);
                    console.log('에러 데이터:', paramData);
                }
            }
        }
        setPrevIndex(index);
        setProductTagFocusedIndex(index);

        if (searchData[index] && searchData[index].recoTag) {
            setRecoProductTag(searchData[index].recoTag.split(',').map((tag) => tag.trim()));
        }
    };

    const handleRemoveWord = (index) => {
        setRecoProductTag((prevWords) => prevWords.filter((_, i) => i !== index));
    };

    const onWordClick = (index, word) => {
        if (productTagCardRefs.current[productTagFocusedIndex]) {
            productTagCardRefs.current[productTagFocusedIndex].setInputValue(word);
        }
    };

    const styledRecoProductTag = recoProductTag.map((word, index) => (
        <span key={index} className="reco-word" onClick={() => onWordClick(productTagFocusedIndex, word)}>
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
                        onSearch={handleSearch}
                    />
                </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: '10px' }}>
                <Col span={12} className="getter-row">
                    <p style={{ fontSize: '20px', textAlign: 'right' }}>
                        상품수: {searchData && searchData.length ? searchData.length : 0}
                    </p>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Space
                        direction="vertical"
                        size="middle"
                        style={{ display: 'flex', width: '100%' }}
                        onKeyDown={handleProductTagKeyDown}
                        tabIndex={0}
                    >
                        {searchData && searchData.length > 0 ? (
                            searchData.map((item, index) => (
                                <ProductTagCard
                                    key={index}
                                    data={item}
                                    isFocused={index === productTagFocusedIndex}
                                    ref={(el) => (productTagCardRefs.current[index] = el)}
                                    onCardFocus={() => onFocusProductTagCard(index)}
                                />
                            ))
                        ) : (
                            <Empty description="검색 결과가 없습니다" />
                        )}
                    </Space>
                </Col>
                <Col span={12}>
                    <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                        <div className="reco-word-container">{styledRecoProductTag}</div>
                    </Space>
                </Col>
            </Row>
        </>
    );
};

export default ProductTagCardSteps;
