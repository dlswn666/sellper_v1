import { Col, Empty, Row, Space, Tree, Card, Button, Tabs, message } from 'antd';
import Search from 'antd/es/input/Search';
import { useEffect, useRef, useState } from 'react';
import { getAutoReco, getCateProduct } from '../../apis/productsApi';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import ProductCategoryCard from './ProductCategoryCard';
import { useProductCategory } from '../../hooks/useProductCategory';
import '../../css/productNameCard.css';
import '../../css/ProductCategoryCardSteps.css';
import { SaveOutlined } from '@ant-design/icons';

const { DirectoryTree } = Tree;

const ProductCategoryCardSteps = () => {
    const [hasMore, setHasMore] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryData, setCategoryData] = useState([]);
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
                categoryPath: selectedCategory.key,
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

            const response = await putProductCategory(categoryData);

            if (response.result) {
                message.success('카테고리가 성공적으로 저장되었습니다.');
                setRecommendedSelectedCategory(null);
                onSearch(searchTerm);
            } else {
                message.error('카테고리 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('추천 카테고리 저장 중 오류 발생:', error);
            message.error('카테고리 저장 중 오류가 발생했습니다.');
        }
    };

    const renderRecommendedCategories = () => {
        const currentProduct = searchData[productCategoryFocusedIndex];
        if (!currentProduct) return null;

        const items = [
            {
                key: 'naver',
                label: '네이버',
                children: currentProduct.naver_recoCate ? (
                    <div className="category-cards">
                        {currentProduct.naver_recoCate.map((category, index) => (
                            <div
                                key={index}
                                className={`category-card ${recommendedSelectedCategory === index ? 'selected' : ''}`}
                                onClick={() => setRecommendedSelectedCategory(index)}
                            >
                                <div className="category-card-content">
                                    <div className="category-path">
                                        <span>{category.categoryNm1}</span>
                                        <span className="arrow">›</span>
                                        <span>{category.categoryNm2}</span>
                                        <span className="arrow">›</span>
                                        <span>{category.categoryNm3}</span>
                                        {category.categoryNm4 && (
                                            <>
                                                <span className="arrow">›</span>
                                                <span>{category.categoryNm4}</span>
                                            </>
                                        )}
                                    </div>
                                    {recommendedSelectedCategory === index && (
                                        <Button
                                            type="primary"
                                            icon={<SaveOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                postRecommendedCategory(category);
                                            }}
                                        >
                                            저장
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description="추천 카테고리가 없습니다" />
                ),
            },
            {
                key: 'B',
                label: 'B몰',
                children: currentProduct.B_recoCate ? (
                    <div className="category-cards">
                        {currentProduct.B_recoCate.map((category, index) => (
                            <div
                                key={index}
                                className={`category-card ${recommendedSelectedCategory === index ? 'selected' : ''}`}
                                onClick={() => setRecommendedSelectedCategory(index)}
                            >
                                <div className="category-card-content">
                                    <div className="category-path">
                                        <span>{category.categoryNm1}</span>
                                        <span className="arrow">›</span>
                                        <span>{category.categoryNm2}</span>
                                        <span className="arrow">›</span>
                                        <span>{category.categoryNm3}</span>
                                        {category.categoryNm4 && (
                                            <>
                                                <span className="arrow">›</span>
                                                <span>{category.categoryNm4}</span>
                                            </>
                                        )}
                                    </div>
                                    {recommendedSelectedCategory === index && (
                                        <Button
                                            type="primary"
                                            icon={<SaveOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                postRecommendedCategory(category);
                                            }}
                                        >
                                            저장
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description="추천 카테고리가 없습니다" />
                ),
            },
            {
                key: 'C',
                label: 'C몰',
                children: currentProduct.C_recoCate ? (
                    <div className="category-cards">
                        {currentProduct.C_recoCate.map((category, index) => (
                            <div
                                key={index}
                                className={`category-card ${recommendedSelectedCategory === index ? 'selected' : ''}`}
                                onClick={() => setRecommendedSelectedCategory(index)}
                            >
                                <div className="category-card-content">
                                    <div className="category-path">
                                        <span>{category.categoryNm1}</span>
                                        <span className="arrow">›</span>
                                        <span>{category.categoryNm2}</span>
                                        <span className="arrow">›</span>
                                        <span>{category.categoryNm3}</span>
                                        {category.categoryNm4 && (
                                            <>
                                                <span className="arrow">›</span>
                                                <span>{category.categoryNm4}</span>
                                            </>
                                        )}
                                    </div>
                                    {recommendedSelectedCategory === index && (
                                        <Button
                                            type="primary"
                                            icon={<SaveOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                postRecommendedCategory(category);
                                            }}
                                        >
                                            저장
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description="추천 카테고리가 없습니다" />
                ),
            },
        ];

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
                    <Card title="카테고리 선택" style={{ minHeight: 'calc(100vh - 200px)' }}>
                        {renderRecommendedCategories()}
                        <DirectoryTree
                            multiple={false}
                            defaultExpandAll
                            onSelect={onSelect}
                            treeData={categoryData}
                            selectedKeys={selectedCategory ? [selectedCategory.key] : []}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ProductCategoryCardSteps;
