import { Affix, Card, Col, Empty, Row, Space, message, Button } from 'antd';
import Search from 'antd/es/input/Search.js';
import { useEffect, useRef, useState } from 'react';
import { getAutoReco, putProductTag } from '../../apis/productsApi.js';
import { getNaverTagInfo } from '../../apis/naverCommerceApi.js';
import useInfiniteScroll from '../../hooks/useInfiniteScroll.js';
import ProductTagCard from './ProductTagCard.js';
import '../../css/productNameCard.css';

const ProductTagCardSteps = ({ mode = 'page', visible, onCancel, initialData, onParentTagSave }) => {
    const [hasMore, setHasMore] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [recoProductTag, setRecoProductTag] = useState([]);
    const [prevIndex, setPrevIndex] = useState(null);
    const [productTagFocusedIndex, setProductTagFocusedIndex] = useState(0);
    const [currentOffset, setCurrentOffset] = useState(0);
    const [limit, setLimit] = useState(10);
    const isLoadMore = useRef(false);
    const productTagCardRefs = useRef([]);

    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);

    useEffect(() => {
        if (mode === 'modal' && initialData) {
            onSearch('', initialData.productId);
        } else {
            onSearch();
        }
    }, [mode]);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            isLoadMore.current = true;
            onSearch(searchTerm);
        }
    }, [page]);

    useEffect(() => {
        if (searchData && searchData.length > 0 && !isLoadMore.current) {
            productTagCardRefs.current[0]?.focusInput();
            onFocusProductTagCard(0);
        }
    }, [searchData]);

    const onSearch = async (value = searchTerm, productId = '') => {
        if (searchLoading) return;

        setSearchLoading(true);

        try {
            const response = await getAutoReco(
                value,
                isLoadMore.current ? page : 1,
                limit,
                'tag',
                currentOffset,
                productId
            );
            const result = response;
            console.log(result);
            if (!isLoadMore.current) {
                setSearchData(result);
                setProductTagFocusedIndex(0);
                setCurrentOffset(limit);
            } else {
                setSearchData((prevData) => [...prevData, ...result]);
                setCurrentOffset((prev) => prev + result.length);
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
            isLoadMore.current = false;
            setLoading(false);
            setSearchLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setHasMore(true);
        setSearchData([]);
        setPage(1);
        isLoadMore.current = false;
        onSearch(value);
    };

    const handleTagSave = async (productId) => {
        if (mode === 'modal') {
            if (typeof onParentTagSave === 'function') {
                onParentTagSave(productId);
            }
        } else {
            const savedItemIndex = searchData.findIndex((item) => item.productId === productId);
            if (savedItemIndex !== -1) {
                const newData = await getAutoReco(searchTerm, 1, 1, 'tag', currentOffset);

                setSearchData((prevData) => {
                    const newArray = [...prevData];
                    newArray.splice(savedItemIndex, 1);
                    if (newData && newData.length > 0) {
                        newArray.push(...newData);
                    }
                    return newArray;
                });

                setCurrentOffset((prev) => prev + 1);
                setProductTagFocusedIndex(0);

                if (productTagCardRefs.current[0]) {
                    productTagCardRefs.current[0].clearTags();
                }
            }
        }
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
        setPrevIndex(index);
        setProductTagFocusedIndex(index);

        if (searchData[index] && searchData[index].recoTag) {
            setRecoProductTag(searchData[index].recoTag.split(',').map((tag) => tag.trim()));
        }
    };

    const handleRemoveWord = (index) => {
        setRecoProductTag((prevWords) => prevWords.filter((_, i) => i !== index));
    };

    const onWordClick = async (index, word) => {
        try {
            const response = await getNaverTagInfo(word);
            if (response && response[0]) {
                if (productTagCardRefs.current[productTagFocusedIndex]) {
                    productTagCardRefs.current[productTagFocusedIndex].addTag(response[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching tag info:', error);
            message.error('태그 정보를 가져오는데 실패했습니다.');
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

    // 모달 저장 핸들러 추가
    const handleModalSave = () => {
        if (initialData?.productId) {
            handleTagSave(initialData.productId);
        }
    };

    // 모달 취소 핸들러 추가
    const handleModalCancel = () => {
        onCancel();
    };

    // 렌더링 부분 수정
    const renderContent = () => (
        <>
            {mode === 'page' && (
                <Row style={{ marginBottom: '16px' }}>
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
            )}
            <Row gutter={16}>
                <Col span={mode === 'modal' ? 24 : 12}>
                    {mode === 'page' ? (
                        <Card title={`작업 상품 목록 (${searchData.length}개)`}>
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
                                            key={`${item.productId}_${index}`}
                                            data={item}
                                            offset={currentOffset - limit}
                                            index={index + 1}
                                            tagInfo={item.tagInfo}
                                            isFocused={index === productTagFocusedIndex}
                                            ref={(el) => (productTagCardRefs.current[index] = el)}
                                            onCardFocus={() => onFocusProductTagCard(index)}
                                            onTagSave={() => handleTagSave(item.productId)}
                                        />
                                    ))
                                ) : (
                                    <Empty description="검색 결과가 없습니다" />
                                )}
                            </Space>
                        </Card>
                    ) : (
                        <Card
                            title="태그 수정"
                            extra={
                                <Space>
                                    <Button onClick={handleModalCancel}>취소</Button>
                                    <Button type="primary" onClick={handleModalSave}>
                                        저장
                                    </Button>
                                </Space>
                            }
                        >
                            <ProductTagCard
                                data={searchData[0]}
                                index={1}
                                tagInfo={searchData[0]?.tagInfo}
                                isFocused={true}
                                ref={(el) => (productTagCardRefs.current[0] = el)}
                                onCardFocus={() => onFocusProductTagCard(0)}
                                mode="modal"
                                onTagSave={() =>
                                    handleModalSave(mode === 'modal' ? initialData.productId : searchData[0].productId)
                                }
                            />
                        </Card>
                    )}
                </Col>
                <Col span={mode === 'modal' ? 24 : 12}>
                    <Affix offsetTop={mode === 'modal' ? 0 : 20}>
                        <Card title="추천 상품명">
                            <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                                <div
                                    className="reco-word-container"
                                    style={{
                                        maxHeight: mode === 'modal' ? '400px' : '800px',
                                        overflowY: 'auto',
                                        padding: '10px',
                                    }}
                                >
                                    {styledRecoProductTag}
                                </div>
                            </Space>
                        </Card>
                    </Affix>
                </Col>
            </Row>
        </>
    );

    if (mode === 'modal') {
        return renderContent();
    }

    return <div style={{ padding: '24px' }}>{renderContent()}</div>;
};

export default ProductTagCardSteps;
