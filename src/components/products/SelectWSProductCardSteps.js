import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Space, Empty, Button, Flex, Table, Divider } from 'antd';
import Search from 'antd/es/input/Search';
import SelectWSProductCard from './SelectWSProductCard';
import { putWorkingData, selectProductData } from '../../apis/productsApi';
import { CheckOutlined, CloseOutlined, FormOutlined } from '@ant-design/icons';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

const SelectWSProductCardSteps = ({ setSearchKeywordUrl, searchKeywordFocusedIndex, setSearchKeywordFocusedIndex }) => {
    const searchKeywordCardRefs = useRef([]);
    const [searchData, setSearchData] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [selectLoading, setSelectLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWSProduct, setSelectedWSProduct] = useState([]); // 선택된 제품 상태

    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);

    const columns = [
        {
            title: '상품 이름',
            dataIndex: 'productName',
        },
        {
            title: '판매 사이트',
            dataIndex: 'siteName',
        },
        {
            title: '판매 가격',
            dataIndex: 'productPrice',
        },
    ];

    useEffect(() => {
        onSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            onSearch(searchTerm, true);
        }
    }, [page]);

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

    const onSearch = async (value = searchTerm, isLoadMore = false) => {
        if (searchLoading) return;

        let limit = 100;

        setSearchLoading(true);
        try {
            const response = await selectProductData(value, isLoadMore ? page : 1, limit);
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
            console.error(error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    const handleCardClick = (data) => {
        const isAlSelected = selectedWSProduct.some((product) => product.productId === data.productId);

        if (isAlSelected) {
            setSelectedWSProduct((prevProduct) =>
                prevProduct.filter((product) => product.productId !== data.productId)
            );
        } else {
            setSelectedWSProduct((prevProduct) => [...prevProduct, data]);
        }
    };

    const selectAll = () => {
        setSelectLoading(true);

        if (searchData && searchData.length > 0) {
            setSelectedWSProduct((prevProduct) => {
                if (prevProduct.length === searchData.length) {
                    // 이미 모든 항목이 선택된 경우 -> 전체 해제
                    return [];
                } else {
                    // 항목이 선택되지 않았거나 일부만 선택된 경우 -> 전체 선택
                    return searchData;
                }
            });
        }

        setSelectLoading(false);
    };

    const save = () => {
        const result = putWorkingData(selectedWSProduct);
        alert(result.message);
        onSearch();
        setSelectedWSProduct([]);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setHasMore(true);
        setSearchData([]);
        setPage(1);
        onSearch(value);
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
            <Row>
                <Col span={12}>
                    <Flex justify="flex-end" align="center" style={{ height: '100px' }}>
                        <Button
                            icon={
                                searchData && searchData.length === selectedWSProduct.length ? (
                                    <CloseOutlined />
                                ) : (
                                    <CheckOutlined />
                                )
                            }
                            type="primary"
                            size={'large'}
                            onClick={selectAll}
                            loading={selectLoading}
                            iconPosition={'end'}
                            style={{ marginRight: '20px' }}
                        >
                            SelectAll
                        </Button>
                        <Button
                            icon={<FormOutlined />}
                            type="primary"
                            size={'large'}
                            onClick={save}
                            loading={saveLoading}
                            iconPosition={'end'}
                        >
                            SAVE
                        </Button>
                    </Flex>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: '10px' }}>
                <Col span={12} className="getter-row">
                    <p style={{ fontSize: '20px', textAlign: 'right' }}>
                        {' '}
                        상품수: {searchData && searchData.length ? searchData.length : 0}
                    </p>
                </Col>
                <Col span={12} className="getter-row">
                    <p style={{ fontSize: '20px', textAlign: 'right' }}>
                        선택 상품: {selectedWSProduct && selectedWSProduct.length ? selectedWSProduct.length : 0}
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
                                <SelectWSProductCard
                                    key={index}
                                    data={item}
                                    isFocused={index === searchKeywordFocusedIndex}
                                    ref={(el) => (searchKeywordCardRefs.current[index] = el)}
                                    onCardFocus={() => onFocusSearchKeywordCard(index)}
                                    onClick={() => handleCardClick(item)}
                                    isSelected={selectedWSProduct.some(
                                        (product) => product.productId === item.productId
                                    )}
                                />
                            ))
                        ) : (
                            <Empty />
                        )}
                    </Space>
                </Col>
                <Col span={12} className="gutter-row">
                    {selectedWSProduct && selectedWSProduct.length > 0 ? (
                        <Table columns={columns} dataSource={selectedWSProduct} />
                    ) : (
                        <Empty />
                    )}
                </Col>
            </Row>
        </>
    );
};

export default SelectWSProductCardSteps;
