import React from 'react';
import { Col, Empty, Row, Space, Tree, Card, Button, Tabs, message, Affix } from 'antd';
import Search from 'antd/es/input/Search.js';
import { useEffect, useRef, useState } from 'react';
import { getCateProduct, getProductById } from '../../apis/productsApi.js';
import useInfiniteScroll from '../../hooks/useInfiniteScroll.js';
import ProductCategoryCard from './ProductCategoryCard.js';
import { useProductCategory } from '../../hooks/useProductCategory.js';
import '../../css/productNameCard.css';
import '../../css/ProductCategoryCardSteps.css';
import { SaveOutlined } from '@ant-design/icons';

const { DirectoryTree } = Tree;

const ProductCategoryCardSteps = () => {
    const [hasMore, setHasMore] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [productCategoryFocusedIndex, setProductCategoryFocusedIndex] = useState(0);
    const productCategoryCardRefs = useRef([]);
    const [prevIndex, setPrevIndex] = useState(null);
    const { putProductCategory } = useProductCategory();
    const [recommendedSelectedCategory, setRecommendedSelectedCategory] = useState(null);
    const [activeTab, setActiveTab] = useState('naver');

    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);

    useEffect(() => {
        onSearch();
    }, []);

    useEffect(() => {
        if (searchData?.length > 0) {
            initializeFirstCard();
        }
    }, [searchData]);

    useEffect(() => {
        if (recommendedSelectedCategory) {
            console.log('recommendedSelectedCategory', recommendedSelectedCategory);
            const categoryPath = [
                recommendedSelectedCategory.categoryNm1,
                recommendedSelectedCategory.categoryNm2,
                recommendedSelectedCategory.categoryNm3,
                recommendedSelectedCategory.categoryNm4,
                recommendedSelectedCategory.categoryNm5,
                recommendedSelectedCategory.categoryNm6,
            ].filter(Boolean);

            const selectedCategoryInfo = {
                node: {
                    key: activeTab,
                    title: `[${activeTab.toUpperCase()}] ${categoryPath.join(' > ')}`,
                    path: categoryPath.join(' > '),
                },
            };
            onSelect([selectedCategoryInfo.node.key], selectedCategoryInfo);
        }
    }, [recommendedSelectedCategory]);

    const initializeFirstCard = () => {
        setTimeout(() => {
            productCategoryCardRefs.current[0]?.focusInput();
            onFocusProductCategoryCard(0);
        }, 100);
    };

    const onSearch = async (value = searchTerm, isLoadMore = false) => {
        if (searchLoading) return;
        setSearchLoading(true);

        try {
            const response = await getCateProduct(value, isLoadMore ? page : 1, 100);
            const result = response || [];

            if (!isLoadMore) {
                setSearchData(result);
                setProductCategoryFocusedIndex(0);
            } else {
                setSearchData((prev) => [...prev, ...result]);
            }

            setHasMore(result.length >= 100);
        } catch (error) {
            console.error('Error:', error);
            setHasMore(false);
        } finally {
            setSearchLoading(false);
            setLoading(false);
        }
    };

    const handleCategoryUpdate = async (index) => {
        if (prevIndex === null || !productCategoryCardRefs.current[prevIndex]) return;

        const prevCard = productCategoryCardRefs.current[prevIndex];
        const selectedCategory = prevCard.getSelectedCategory();

        if (!selectedCategory || !searchData[prevIndex]) return;

        try {
            await putProductCategory({
                productId: searchData[prevIndex].productId,
                platformId: activeTab,
            });
        } catch (error) {
            console.error('카테고리 업데이트 중 오류 발생:', error);
        }
    };

    const onFocusProductCategoryCard = (index) => {
        handleCategoryUpdate(index);
        setPrevIndex(index);
        setProductCategoryFocusedIndex(index);
        setRecommendedSelectedCategory(null);

        const currentProduct = searchData[index];
        if (currentProduct?.naver_recoCate) {
            try {
                // 추천 카테고리 데이터 처리
                console.log(currentProduct);
            } catch (error) {
                console.error('카테고리 파싱 에러:', error);
            }
        }
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const postRecommendedCategory = async (category) => {
        try {
            const currentProduct = searchData[productCategoryFocusedIndex];
            if (!currentProduct) {
                console.error('선택된 상품이 없습니다.');
                return;
            }

            const categoryData = {
                productId: currentProduct.workingProductId,
                categoryNo1: category.categoryNm1,
                categoryNo2: category.categoryNm2,
                categoryNo3: category.categoryNm3,
                categoryNo4: category.categoryNm4,
                categoryNo5: category.categoryNm5,
                categoryNo6: category.categoryNm6,
                platformId: activeTab,
            };

            console.log('categoryData', categoryData);

            const response = await putProductCategory(categoryData);

            if (response.result) {
                message.success('카테고리가 성공적으로 저장되었습니다.');

                // 개별 상품 정보 업데이트
                const updatedProduct = await getProductById(currentProduct.workingProductId);

                // 현재 상품 데이터 업데이트
                const newSearchData = [...searchData];
                const updatedItem = {
                    workingProductId: updatedProduct[0].workingProductId,
                    productCode: updatedProduct[0].productCode,
                    productName: updatedProduct[0].productName,
                    wholeProductName: updatedProduct[0].wholeProductName,
                    wholeProductPrice: updatedProduct[0].wholeProductPrice,
                    wholesaleProductId: updatedProduct[0].wholesaleProductId,
                    siteId: updatedProduct[0].siteId,
                    siteName: updatedProduct[0].siteName,
                    searchWord: updatedProduct[0].searchWord,
                    naverCategory: updatedProduct[0].naverCategory,
                    coupangCategory: updatedProduct[0].coupangCategory,
                    platformTag: updatedProduct[0].platformTag,
                    thumbnail: currentProduct.thumbnail, // 기존 썸네일 유지
                    naver_recoCate: updatedProduct[0].naver_recoCate,
                    B_recoCate: updatedProduct[0].B_recoCate,
                    C_recoCate: updatedProduct[0].C_recoCate,
                };

                // 현재 인덱스의 데이터를 업데이트된 데이터로 교체
                newSearchData[productCategoryFocusedIndex] = updatedItem;
                console.log('newSearchData', newSearchData);

                // 업데이트된 상품을 배열 맨 뒤로 이동
                const [movedItem] = newSearchData.splice(productCategoryFocusedIndex, 1);
                newSearchData.push(movedItem);

                setSearchData(newSearchData);
                // 첫 번째 카드에 포커스
                setProductCategoryFocusedIndex(0);
                setRecommendedSelectedCategory(null);
                setSelectedCategory(null); // 선택된 카테고리 초기화
                // onSelect([], null);

                setTimeout(() => {
                    productCategoryCardRefs.current[0]?.focusInput();
                }, 100);
            } else {
                message.error('카테고리 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('추천 카테고리 저장 중 오류 발생:', error);
            message.error('카테고리 저장 중 오류가 발생했습니다.');
        }
    };

    const renderCategoryPath = (category) => {
        const categoryLevels = [1, 2, 3, 4, 5, 6];
        return (
            <div className="category-path">
                {categoryLevels.map((level, idx) => {
                    const categoryKey = `categoryNm${level}`;
                    if (!category[categoryKey]) return null;

                    return (
                        <React.Fragment key={idx}>
                            {idx > 0 && <span className="arrow">›</span>}
                            <span>{category[categoryKey]}</span>
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    const renderCategoryCard = (category, index, platformId) => (
        <div
            key={index}
            className={`category-card ${recommendedSelectedCategory === category ? 'selected' : ''}`}
            onClick={() => setRecommendedSelectedCategory(category)}
        >
            <div className="category-card-content">
                {renderCategoryPath(category)}
                {recommendedSelectedCategory === category && (
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            postRecommendedCategory(category);
                        }}
                    >
                        확인
                    </Button>
                )}
            </div>
        </div>
    );

    const renderRecommendedCategories = () => {
        const currentProduct = searchData[productCategoryFocusedIndex];
        if (!currentProduct) return null;

        const platforms = [
            { key: 'naver', label: '네이버', dataKey: 'naver_recoCate' },
            { key: 'gmarket', label: 'G마켓', dataKey: 'B_recoCate' },
            { key: 'C', label: 'C몰', dataKey: 'C_recoCate' },
        ];

        const items = platforms.map((platform) => ({
            key: platform.key,
            label: platform.label,
            children: currentProduct[platform.dataKey] ? (
                <div className="category-cards">
                    {currentProduct[platform.dataKey].map((category, index) =>
                        renderCategoryCard(category, index, platform.key)
                    )}
                </div>
            ) : (
                <Empty description="추천 카테고리가 없습니다" />
            ),
        }));

        return (
            <div className="recommended-categories">
                <h3>추천 카테고리</h3>
                <Tabs defaultActiveKey="naver" onChange={handleTabChange} items={items} />
            </div>
        );
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPage(1);
        setHasMore(true);
        onSearch(value);
    };

    const onSelect = (selectedKeys, info) => {
        setSelectedCategory(info.node);
        if (productCategoryCardRefs.current[productCategoryFocusedIndex]) {
            productCategoryCardRefs.current[productCategoryFocusedIndex].setSelectedCategory(info.node);
        }
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
            <Row gutter={16} style={{ marginTop: '16px' }}>
                <Col span={12}>
                    <Card
                        title={`작업 상품 목록 (${searchData.length}개)`}
                        style={{ minHeight: 'calc(100vh - 200px)' }}
                    >
                        <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                            {searchData?.length > 0 ? (
                                searchData.map((item, index) => (
                                    <ProductCategoryCard
                                        key={item.workingProductId}
                                        data={item}
                                        index={index}
                                        isFocused={index === productCategoryFocusedIndex}
                                        ref={(el) => (productCategoryCardRefs.current[index] = el)}
                                        onCardFocus={() => onFocusProductCategoryCard(index)}
                                    />
                                ))
                            ) : (
                                <Empty description="검색 결과가 없습니다" />
                            )}
                        </Space>
                    </Card>
                </Col>
                <Col span={12}>
                    <Affix offsetTop={100}>
                        <Card title="카테고리 선택" style={{ minHeight: 'calc(100vh - 200px)' }}>
                            {renderRecommendedCategories()}
                        </Card>
                    </Affix>
                </Col>
            </Row>
        </>
    );
};

export default ProductCategoryCardSteps;
