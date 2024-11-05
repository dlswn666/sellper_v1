import { Col, Row, Space } from 'antd';
import Search from 'antd/es/transfer/search';
import { useState } from 'react';
import { getAutoReco } from '../../apis/productsApi';
import { result } from 'lodash';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

const ProductTageCardSteps = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);
    const [productTagFocusedIndex, setProductTagFocusedIndex] = useState(0);

    useState(() => {
        onSearch();
    });

    const onSearch = async (value = searchTerm, isLoadMore = false) => {
        if (searchLoading) return;
        let limit = 100;
        setSearchLoading(true);

        try {
            const response = await getAutoReco(value, isLoadMore ? page : 1, limit);
            console.log(response);
            if (!isLoadMore) {
                setSearchData(response);
            } else {
                setSearchData((prevData) => [...prevData, ...response]);
            }
            if (response && searchData) {
                if (response.length < limit || searchData.length + response.length >= response.total_count) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.log(error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    const handleProductTagKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            console.log('focus1');
            setProductTagFocusedIndex((prevIndex) => {
                const newIndex = Math.min(prevIndex + 1, 0);
                productNameCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        } else if (e.key === 'ArrowUp') {
            setProductTagFocusedIndex((prevIndex) => {
                console.log('focus2');
                const newIndex = Math.max(prevIndex - 1, 0);
                productNameCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        }
        console.log('focus3');
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
                    ></Search>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <Space
                        direction="vertical"
                        size="middle"
                        style={{ display: 'flex', width: '100%' }}
                        onKeyDown={handleProductTagKeyDown}
                        tabIndex={0}
                    ></Space>
                </Col>
            </Row>
        </>
    );
};

export default ProductTageCardSteps;
