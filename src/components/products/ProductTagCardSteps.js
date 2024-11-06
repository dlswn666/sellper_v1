import { Col, Empty, Row, Space } from 'antd';
import Search from 'antd/es/input/Search';
import { useEffect, useRef, useState } from 'react';
import { getAutoReco } from '../../apis/productsApi';
import { result } from 'lodash';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import ProductTagCard from './ProductTagCard';

const ProductTageCardSteps = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);
    const [prevIndex, setPrevIndex] = useState(null);
    const [productTagFocusedIndex, setProductTagFocusedIndex] = useState(0);
    const [recoProductTag, setRecoProductTag] = useState([]);
    const productTagCardRefs = useRef([]);

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
            const response = await getAutoReco(value, isLoadMore ? page : 1, limit, 'tag');
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

    const onFocusProductTagCard = (index) => {
        if (prevIndex != null && productTagCardRefs.current[prevIndex]) {
            const prevValue = productTagCardRefs.current[prevIndex].getInputValue();
            if (prevValue) {
                console.log('이전 인덱스:', prevIndex, '값:', prevValue);
                let paramData = {
                    ...searchData[prevIndex],
                    productName: prevValue,
                };

                // const response = reqPutProductName(paramData);
            }
        }
        // 새로운 인덱스를 이전 인덱스로 저장
        setPrevIndex(index);
        setProductTagFocusedIndex(index);

        if (searchData[index]) {
            setRecoProductTag(searchData[index].recoProductNm.split(','));
        }
    };

    const handleProductTagKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            console.log('focus1');
            setProductTagFocusedIndex((prevIndex) => {
                const newIndex = Math.min(prevIndex + 1, 0);
                productTagCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        } else if (e.key === 'ArrowUp') {
            setProductTagFocusedIndex((prevIndex) => {
                console.log('focus2');
                const newIndex = Math.max(prevIndex - 1, 0);
                productTagCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        }
        console.log('focus3');
    };

    const handleRemoveWord = (index) => {
        setRecoProductTag((prevWords) => prevWords.filter((_, i) => i !== index));
    };

    const onWordClick = (index, word) => {
        if (productTagCardRefs.current[index]) {
            productTagCardRefs.current[index].setInputValue(word); // 선택한 단어를 해당 카드의 input에 설정
        }
    };

    // 스타일링과 클릭 핸들러를 적용하여 단어를 렌더링
    const styledRecoProductTag = recoProductTag.map((word, index) => (
        <span
            key={index}
            style={{
                padding: '5px 10px',
                margin: '5px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                display: 'inline-block',
                cursor: 'pointer',
                position: 'relative', // 상대 위치 설정
            }}
            onClick={() => onWordClick(productTagFocusedIndex, word)} // 클릭 시 input에 데이터 전달
            onMouseEnter={(e) => {
                const closeButton = e.currentTarget.querySelector('.remove-icon');
                if (closeButton) closeButton.style.visibility = 'visible'; // 마우스 올릴 때 보이게 설정
            }}
            onMouseLeave={(e) => {
                const closeButton = e.currentTarget.querySelector('.remove-icon');
                if (closeButton) closeButton.style.visibility = 'hidden'; // 마우스 벗어나면 숨기기
            }}
        >
            {word.trim()}
            <span
                onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveWord(index);
                }}
                style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    color: '#212529',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    visibility: 'hidden', // 기본적으로 숨기기
                }}
                className="remove-icon"
            >
                x
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
                                ></ProductTagCard>
                            ))
                        ) : (
                            <Empty />
                        )}
                    </Space>
                </Col>
                <Col span={12}>
                    <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                        <span> {styledRecoProductTag}</span>
                    </Space>
                </Col>
            </Row>
        </>
    );
};

export default ProductTageCardSteps;
