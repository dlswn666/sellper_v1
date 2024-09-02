import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Space, Empty } from 'antd';
import Search from 'antd/es/input/Search';
import SearchKeywordCard from './SearchKeywordCard';
import { selectWorkingSearchWord } from '../../apis/productsApi';

const SearchKeywordCardStep = ({
    searchKeywordUrl,
    setSearchKeywordUrl,
    searchKeywordFocusedIndex,
    setSearchKeywordFocusedIndex,
}) => {
    const searchKeywordCardRefs = useRef([]);
    const [loading, setLoading] = useState(false);
    const [searchData, setSearchData] = useState([]); // 초기 상태를 빈 배열로 설정
    const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
    const [page, setPage] = useState(1); // 현재 페이지를 트래킹

    useEffect(() => {
        onSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
                loading
            ) {
                return;
            }
            if (hasMore) {
                onSearch(searchKeywordUrl, true); // 추가 데이터를 로드
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore, searchKeywordUrl]);

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

    const onSearch = async (value, isLoadMore = false) => {
        setLoading(true);
        try {
            const wspData = await selectWorkingSearchWord(value, page); // 페이지 번호와 검색어를 API에 전달
            if (wspData.length < 50) {
                setHasMore(false); // 불러온 데이터가 50개 미만이라면 더 이상 데이터가 없음
            }
            if (isLoadMore) {
                setSearchData((prevData) => [...prevData, ...wspData]);
            } else {
                setSearchData(wspData);
            }
            setPage((prevPage) => prevPage + 1); // 다음 페이지 번호로 증가
            setSearchKeywordUrl(wspData[0]?.detailPageUrl || '');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Row>
                <Col span={24} style={{ height: '100px' }}>
                    <Search
                        placeholder="상품 검색어를 입력해 주세요"
                        enterButton="Search"
                        size="large"
                        loading={loading}
                        onSearch={onSearch}
                    />
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
