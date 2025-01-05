import { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Space, Empty, Affix } from 'antd';
import Search from 'antd/es/input/Search.js';
import useInfiniteScroll from '../../hooks/useInfiniteScroll.js';
import { getProductAttributeData, getProductDetailImage, getProductThumbnail } from '../../apis/productsApi.js';
import ThumbnailUploadCard from './ThumbnailUploadCard.js';

export const ThumbnailUploadCardSteps = () => {
    const [fileList, setFileList] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);
    const [thumbnailUpdateData, setThumbnailUpdateData] = useState([]);
    const [thumbnailUpdateFocusedIndex, setThumbnailUpdateFocusedIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);
    const thumbnailUpdateCardRefs = useRef([]);
    const [detailImage, setDetailImage] = useState(null);
    const [thumbnailData, setThumbnailData] = useState(null);

    useEffect(() => {
        onSearch();
    }, []);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            onSearch(searchTerm, true);
        }
    }, [page]);

    const onSearch = async (productId = '', search = searchTerm, isLoadMore = false) => {
        if (searchLoading) return;
        setSearchLoading(true);

        try {
            const result = await getProductAttributeData(productId, search, isLoadMore ? page : 1, 100, 'thumbnail');
            if (!isLoadMore) {
                setThumbnailUpdateData(result);
                setThumbnailUpdateFocusedIndex(0);
                const detailImageData = await getProductDetailImage(result[0]?.wholesaleProductId);
                setDetailImage(detailImageData);
                console.log(result);
            } else {
                setThumbnailUpdateData((prev) => [...prev, ...result]);
            }
            setHasMore(result.length >= 100);
        } catch (error) {
            console.error('Error fetching attributes:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    const onFocusThumbnailUpdateCard = async (index) => {
        if (index === prevIndex) return;

        setPrevIndex(index);
        setThumbnailUpdateFocusedIndex(index);

        const detailImageContainer = document.querySelector('.detail-image-container');
        if (detailImageContainer) {
            detailImageContainer.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }

        const wholesaleProductId = thumbnailUpdateData[index]?.wholesaleProductId;
        if (wholesaleProductId) {
            const detailImage = await getProductDetailImage(wholesaleProductId);
            setDetailImage(detailImage);
            const thumbnailData = await getProductThumbnail(wholesaleProductId);
            setThumbnailData(thumbnailData);
        }
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onSearch={onSearch}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title="썸네일 업로드">
                        <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                            {thumbnailUpdateData?.length > 0 ? (
                                thumbnailUpdateData.map((item, index) => (
                                    <ThumbnailUploadCard
                                        key={item.productId}
                                        data={item}
                                        thumbnailData={thumbnailData}
                                        isFocused={index === thumbnailUpdateFocusedIndex}
                                        onCardFocus={() => onFocusThumbnailUpdateCard(index)}
                                        ref={(el) => (thumbnailUpdateCardRefs.current[index] = el)}
                                    />
                                ))
                            ) : (
                                <Empty description="검색 결과가 없습니다" />
                            )}
                        </Space>
                    </Card>
                </Col>
                <Col span={12}>
                    <Affix offsetTop={24}>
                        {detailImage?.length > 0 ? (
                            <Card title="상품 상세 이미지">
                                <div
                                    style={{
                                        maxHeight: 'calc(100vh - 200px)',
                                        overflowY: 'auto',
                                        position: 'sticky',
                                        top: '0px',
                                    }}
                                    className="detail-image-container"
                                >
                                    {detailImage.map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginBottom: '16px',
                                            }}
                                        >
                                            <img
                                                src={item?.detailImageUrl}
                                                alt={`상품 상세 이미지 ${index + 1}`}
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ) : (
                            <Empty description="상품 상세 이미지가 없습니다" />
                        )}
                    </Affix>
                </Col>
            </Row>
        </div>
    );
};

export default ThumbnailUploadCardSteps;
