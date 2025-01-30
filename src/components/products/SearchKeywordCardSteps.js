import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Empty, Card, Affix } from 'antd';
import Search from 'antd/es/input/Search.js';
import SearchKeywordCard from './SearchKeywordCard.js';
import { selectWorkingSearchWord } from '../../apis/productsApi.js';
import useInfiniteScroll from '../../hooks/useInfiniteScroll.js';

const SearchKeywordCardStep = ({ searchKeywordFocusedIndex, setSearchKeywordFocusedIndex }) => {
    const searchKeywordCardRefs = useRef([]);
    const [searchData, setSearchData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchKeywordUrl, setSearchKeywordUrl] = useState('');
    const [detailImage, setDetailImage] = useState('');

    const { page, setPage, setLoading } = useInfiniteScroll(hasMore, false);

    useEffect(() => {
        onSearch();
    }, []);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            onSearch(searchTerm, true);
        }
    }, [page]);

    const onSearch = async (value = searchTerm, isLoadMore = false) => {
        if (searchLoading) return;
        let limit = 10;
        setSearchLoading(true);

        try {
            const response = await selectWorkingSearchWord(value, isLoadMore ? page : 1, limit);
            const { result: wspData, total: totalCount } = response;

            if (!isLoadMore) {
                setSearchData(wspData);
                setSearchKeywordFocusedIndex(0);
            } else {
                setSearchData((prevData) => [...prevData, ...wspData]);
            }
            if (wspData && searchData) {
                if (wspData.length < limit || searchData.length + wspData.length >= totalCount) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error.message || error);
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

    const handleSearchKeywordKeyDown = (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
            setSearchKeywordFocusedIndex((prevIndex) => {
                const newIndex = Math.min(prevIndex + 1, searchData.length - 1);
                searchKeywordCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        } else if (e.key === 'ArrowUp') {
            setSearchKeywordFocusedIndex((prevIndex) => {
                const newIndex = Math.max(prevIndex - 1, 0);
                searchKeywordCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        }
    };

    const onFocusSearchKeywordCard = (index) => {
        setSearchKeywordFocusedIndex(index);
        setDetailImage(searchData[index].detailImage);
        setSearchKeywordUrl(searchData[index].detailPageUrl);
    };

    return (
        <div style={{ padding: '24px' }}>
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
            <Row gutter={16} style={{ marginTop: '16px' }}>
                <Col span={12} className="gutter-row">
                    <Card title={`상품수 (${searchData && searchData.length ? searchData.length : 0}개)`}>
                        <div
                            className="search-keyword-list"
                            style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}
                            onKeyDown={handleSearchKeywordKeyDown}
                            tabIndex={0}
                        >
                            {searchData && searchData.length > 0 ? (
                                searchData.map((item, index) => (
                                    <SearchKeywordCard
                                        key={index}
                                        data={item}
                                        index={index + 1}
                                        isFocused={index === searchKeywordFocusedIndex}
                                        ref={(el) => (searchKeywordCardRefs.current[index] = el)}
                                        onCardFocus={() => onFocusSearchKeywordCard(index)}
                                    />
                                ))
                            ) : (
                                <Empty />
                            )}
                        </div>
                    </Card>
                </Col>
                <Col span={12} className="getter-row">
                    <Affix offsetTop={24}>
                        <Card title="상품 상세 페이지" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            {detailImage ? (
                                detailImage.map((item) => <img src={item.dtlImgUrl} alt="상품 상세 이미지" />)
                            ) : (
                                <Empty />
                            )}
                        </Card>
                        <h2> 1. 배치 테이블 관리 시스템 개발 필요</h2>
                    </Affix>
                </Col>
            </Row>
        </div>
    );
};

export default SearchKeywordCardStep;
