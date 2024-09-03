import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Space, Empty } from 'antd';
import Search from 'antd/es/input/Search';
import SearchKeywordCard from './SearchKeywordCard';
import { selectWorkingSearchWord } from '../../apis/productsApi';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

const SearchKeywordCardStep = ({ searchKeywordFocusedIndex, setSearchKeywordFocusedIndex }) => {
    const searchKeywordCardRefs = useRef([]);
    const [searchData, setSearchData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchKeywordUrl, setSearchKeywordUrl] = useState('');

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

        setSearchLoading(true);

        try {
            const response = await selectWorkingSearchWord(value, isLoadMore ? page : 1);
            const { result: wspData, total: totalCount } = response;

            if (!isLoadMore) {
                setSearchData(wspData);
                setSearchKeywordFocusedIndex(0);
            } else {
                setSearchData((prevData) => [...prevData, ...wspData]);
            }
            if (wspData && searchData) {
                if (wspData.length < 50 || searchData.length + wspData.length >= totalCount) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error.message || error);
            setHasMore(false);
        } finally {
            console.log('finally?');
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
        setSearchKeywordUrl(searchData[index].detailPageUrl);
    };

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
                        {' '}
                        상품수: {searchData && searchData.length ? searchData.length : 0}
                    </p>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12} className="gutter-row">
                    <Space
                        direction="vertical"
                        size={'middle'}
                        style={{ display: 'flex' }}
                        onKeyDown={handleSearchKeywordKeyDown}
                        tabIndex={0}
                    >
                        {searchData && searchData.length > 0 ? (
                            searchData.map((item, index) => (
                                <SearchKeywordCard
                                    key={index}
                                    data={item}
                                    isFocused={index === searchKeywordFocusedIndex}
                                    ref={(el) => (searchKeywordCardRefs.current[index] = el)}
                                    onCardFocus={() => onFocusSearchKeywordCard(index)}
                                />
                            ))
                        ) : (
                            <Empty />
                        )}
                    </Space>
                </Col>
                <Col span={12} className="getter-row">
                    {searchKeywordUrl && (
                        <iframe
                            src={searchKeywordUrl}
                            title="Embedded Webpage"
                            width="100%"
                            height="1200px"
                            style={{
                                position: 'sticky',
                                top: '0px',
                                transform: `scale(0.6)`,
                                transformOrigin: '0 0',
                                width: `${100 / 0.6}%`,
                                height: '1600px',
                                border: 'none',
                            }}
                        />
                    )}
                </Col>
            </Row>
        </>
    );
};

export default SearchKeywordCardStep;
