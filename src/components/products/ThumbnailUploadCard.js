import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { Card, Image, Row, Col, Divider, message, Typography, Button } from 'antd';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';
import '../../css/ImagePreview.css';
import { FileUploadComponent } from '../FileUploadComponent.js';
import { postProductThumbnail, postNaverProductThumbnail } from '../../apis/productsApi.js';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const { Text } = Typography;

const ThumbnailUploadCard = forwardRef(({ data, isFocused, onCardFocus }, ref) => {
    const cardRef = useRef(null);
    const [thumbNailUrl, setThumbNailUrl] = useState([]);
    const imageSrc = data.thumbnail && data.thumbnail.length > 0 ? data.thumbnail[0].thumbNailUrl : defaultImage;

    useEffect(() => {
        const urls = data.thumbnail?.map((item) => item.thumbNailUrl) || [];
        setThumbNailUrl(urls);
    }, [data]);

    const handleUpload = async (fileList) => {
        try {
            const formData = new FormData();

            // 여러 파일 처리
            fileList.forEach((file, index) => {
                formData.append('images', file.originFileObj);
            });

            // wholesaleProductId 추가
            formData.append('wholesaleProductId', data.wholesaleProductId);

            const response = await postProductThumbnail(formData);

            if (response.data.success) {
                message.success(response.data.message);
                const newUrls = response.data.data.map((file) => file.filePath);
                setThumbNailUrl((prevUrls) => [...prevUrls, ...newUrls]);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('업로드 중 에러 발생:', error);
            message.error(error.message || '이미지 업로드에 실패했습니다.');
        }
    };

    const handleNaverUpload = async () => {
        try {
            const param = {
                wholesaleProductId: data.wholesaleProductId,
            };
            const response = await postNaverProductThumbnail(param);
            if (response.success) {
                message.success(response.message);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('네이버 이미지 업로드 중 에러 발생:', error);
            message.error('네이버 이미지 업로드에 실패했습니다.');
        }
    };

    return (
        <Card
            ref={cardRef}
            hoverable
            className="card-move-animation"
            style={{ width: '100%', border: isFocused ? '2px solid #1890ff' : '1px solid #d9d9d9' }}
            onClick={onCardFocus}
            tabIndex={0}
            actions={[
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '16px', gap: '8px' }}>
                    <FileUploadComponent
                        onUpload={handleUpload}
                        maxFileCount={10}
                        title="썸네일 이미지 업로드"
                        buttonText="이미지 선택"
                        maxSize={5}
                        imageSize={150}
                    />
                    <Button type="primary" onClick={handleNaverUpload}>
                        네이버 이미지 업로드
                    </Button>
                </div>,
            ]}
        >
            <Image.PreviewGroup items={thumbNailUrl.length > 0 ? thumbNailUrl : [defaultImage]}>
                <div style={{ display: 'flex', flex: 1 }}>
                    <Image width={150} src={imageSrc} fallback={defaultImage} alt="Product Image" />
                    <div style={{ marginLeft: 16, flex: 1 }}>
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">상품 이름</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">{data.wholeProductName}</p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">판매 사이트</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={6}>
                                <p className="data-content">{data.siteName}</p>
                            </Col>
                            <Col span={5}>
                                <p className="data-title">상품 번호</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={6}>
                                <p className="data-content">{data.productCode}</p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row>
                            <Col span={5}>
                                <p className="data-title">판매 가격</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={6}>
                                <p className="data-content">{data.productPrice}</p>
                            </Col>
                            <Col span={5}>
                                <p className="data-title">설정 검색어</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={6}>
                                <p className="data-content">{data.searchWord}</p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row>
                            <Col span={5}>
                                <p className="data-title">가공 상품 이름</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">{data.productName}</p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row className="table-row" gutter={[4, 1]}>
                            <Col span={5}>
                                <p className="data-title">상세 페이지</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">
                                    <a
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const screenWidth = window.screen.width;
                                            const screenHeight = window.screen.height;
                                            const windowWidth = 1200;
                                            const windowHeight = 800;
                                            const left = screenWidth - windowWidth;
                                            const top = 0;

                                            window.open(
                                                data.detailPageUrl,
                                                '_blank',
                                                `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`
                                            );
                                        }}
                                        href={data.detailPageUrl}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        상세페이지 이동
                                    </a>
                                </p>
                            </Col>
                        </Row>
                        <Divider className="divider" />
                        <Row>
                            <Col span={5}>
                                <p className="data-title">설정 태그</p>
                            </Col>
                            <Col span={1}>
                                <p className="data-title">:</p>
                            </Col>
                            <Col span={18}>
                                <p className="data-content">
                                    {data.platformTag
                                        ?.split(' ')
                                        .map((tag, index) => (tag ? `#${tag} ` : ''))
                                        .join(' ')}
                                </p>
                            </Col>
                        </Row>
                        {data.naverCategory && (
                            <>
                                <Divider className="divider" />
                                <Row className="table-row" gutter={[4, 1]}>
                                    <Col span={5}>
                                        <p className="data-title">네이버 카테고리</p>
                                    </Col>
                                    <Col span={1}>
                                        <p className="data-title">:</p>
                                    </Col>
                                    <Col span={18}>{data.naverCategory}</Col>
                                </Row>
                            </>
                        )}
                        {data.coupangCategory && (
                            <>
                                <Divider className="divider" />
                                <Row className="table-row" gutter={[4, 1]}>
                                    <Col span={5}>
                                        <p className="data-title">쿠팡 카테고리</p>
                                    </Col>
                                    <Col span={1}>
                                        <p className="data-title">:</p>
                                    </Col>
                                    <Col span={18}>{data.coupangCategory}</Col>
                                </Row>
                            </>
                        )}
                        {data.gmarketCategory && (
                            <>
                                <Divider className="divider" />
                                <Row className="table-row" gutter={[4, 1]}>
                                    <Col span={5}>
                                        <p className="data-title">G마켓 카테고리</p>
                                    </Col>
                                    <Col span={1}>
                                        <p className="data-title">:</p>
                                    </Col>
                                    <Col span={18}>{data.gmarketCategory}</Col>
                                </Row>
                            </>
                        )}
                        {data.elevenstCategory && (
                            <>
                                <Divider className="divider" />
                                <Row className="table-row" gutter={[4, 1]}>
                                    <Col span={5}>
                                        <p className="data-title">11번가 카테고리</p>
                                    </Col>
                                    <Col span={1}>
                                        <p className="data-title">:</p>
                                    </Col>
                                    <Col span={18}>{data.elevenstCategory}</Col>
                                </Row>
                            </>
                        )}
                        <Divider className="divider" />
                        <Row>
                            <Col span={24}>
                                <Text strong>썸네일 이미지</Text>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                    <Image.PreviewGroup>
                                        {data.uploadThumbnail?.length > 0 ? (
                                            data.uploadThumbnail.map((item, index) => (
                                                <div
                                                    key={item.imgName}
                                                    style={{
                                                        cursor: 'pointer',
                                                        border: '1px solid #d9d9d9',
                                                        padding: '8px',
                                                        borderRadius: '4px',
                                                    }}
                                                >
                                                    <Image
                                                        src={`${REACT_APP_BASE_URL}${item.imgPath}`}
                                                        fallback={defaultImage}
                                                        alt={`썸네일 이미지 ${index + 1}`}
                                                        style={{ width: 100, height: 100, objectFit: 'cover' }}
                                                    />
                                                    <Text
                                                        style={{
                                                            display: 'block',
                                                            textAlign: 'center',
                                                            marginTop: '4px',
                                                        }}
                                                    >
                                                        이미지 {index + 1}
                                                    </Text>
                                                </div>
                                            ))
                                        ) : (
                                            <div>
                                                <p>썸네일 이미지가 없습니다.</p>
                                            </div>
                                        )}
                                    </Image.PreviewGroup>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Image.PreviewGroup>
        </Card>
    );
});

export default ThumbnailUploadCard;
