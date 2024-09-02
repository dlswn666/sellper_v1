import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Space, Empty, Button, Flex, Table, Divider } from 'antd';
import Search from 'antd/es/input/Search';
import SelectWSProductCard from './SelectWSProductCard';
import { putWorkingData, selectProductData } from '../../apis/productsApi';
import { CheckOutlined, CloseOutlined, FormOutlined } from '@ant-design/icons';

const SelectWSProductCardSteps = ({
    searchKeywordUrl,
    setSearchKeywordUrl,
    searchKeywordFocusedIndex,
    setSearchKeywordFocusedIndex,
}) => {
    useEffect(() => {
        onSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const searchKeywordCardRefs = useRef([]);
    const [searchData, setSearchData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectLoading, setSelectLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [selectedWSProduct, setSelectedWSProduct] = useState([]); // 선택된 제품 상태

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

    const onSearch = async (value) => {
        setLoading(true);
        try {
            const wspData = await selectProductData(value); // 검색어를 API에 전달
            setSearchData(wspData);
            setSearchKeywordUrl(wspData[0]?.detailPageUrl || '');
            setTimeout(() => {
                setLoading(false);
            }, 500); // 500ms (0.5초) 지연 설정
        } catch (error) {
            console.error(error);
            setLoading(false);
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
        putWorkingData(selectedWSProduct);
        console.log(selectedWSProduct);
    };

    return (
        <>
            <Row>
                <Col span={24}>
                    <Search
                        placeholder="상품 검색어를 입력해 주세요"
                        enterButton="Search"
                        size="large"
                        loading={loading}
                        onSearch={onSearch}
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
