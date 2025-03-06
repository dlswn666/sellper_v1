import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Divider,
    Image,
    Input,
    Checkbox,
    Select,
    Button,
    Carousel,
    InputNumber,
    Typography,
    DatePicker,
    Empty,
    message,
} from 'antd';
import defaultImage from '../../assets/errorImage/20191012_174111.jpg';
import '../../css/ProductAttributeCard.css';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { postProductAttribute } from '../../apis/productsApi.js';
import {
    getProductAttributeValues,
    getProductAttributes,
    getNaverCategory,
    getNaverProductForProvidedNotice,
} from '../../apis/naverCommerceApi.js';
import dayjs from 'dayjs';

const { Text } = Typography;

const formatKRW = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const naverUnitList = [
    { value: '', label: '단위' },
    { value: 'A02001', label: 'L' },
    { value: 'A02002', label: 'kg' },
    { value: 'A02003', label: '평' },
    { value: 'A02004', label: '구' },
    { value: 'A02005', label: '인용' },
    { value: 'A02006', label: '잔' },
    { value: 'A02008', label: 'g' },
    { value: 'A02009', label: '인치' },
    { value: 'A02010', label: '만화소' },
    { value: 'A02011', label: '배' },
    { value: 'A02013', label: 'cc' },
    { value: 'A02014', label: 'dpi' },
    { value: 'A02015', label: '만' },
    { value: 'A02016', label: 'ppm' },
    { value: 'A02017', label: 'bit' },
    { value: 'A02018', label: 'GB' },
    { value: 'A02019', label: 'RPM' },
    { value: 'A02020', label: 'W' },
    { value: 'A02021', label: 'Mb/s' },
    { value: 'A02022', label: '포트' },
    { value: 'A02025', label: '개' },
    { value: 'A02026', label: '단계' },
    { value: 'A02028', label: '병' },
    { value: 'A02029', label: '매트' },
    { value: 'A02030', label: 'GHz' },
    { value: 'A02031', label: 'lux' },
    { value: 'A02033', label: '시간' },
    { value: 'A02034', label: 'cm' },
    { value: 'A02035', label: 'MHz' },
    { value: 'A02036', label: 'mm' },
    { value: 'A02037', label: 'A' },
    { value: 'A02038', label: 'dB' },
    { value: 'A02039', label: 'Kbps' },
    { value: 'A02040', label: 'lpi' },
    { value: 'A02041', label: 'pps' },
    { value: 'A02042', label: '프레임' },
    { value: 'A02043', label: 'cd/㎡' },
    { value: 'A02044', label: 'SPF' },
    { value: 'A02045', label: 'm' },
    { value: 'A02046', label: 'km' },
    { value: 'A02047', label: 'yd' },
    { value: 'A02048', label: 'mile' },
    { value: 'A02049', label: '자' },
    { value: 'A02050', label: 'mg' },
    { value: 'A02051', label: '톤' },
    { value: 'A02052', label: '파운드' },
    { value: 'A02053', label: '돈' },
    { value: 'A02054', label: '근' },
    { value: 'A02055', label: '냥' },
    { value: 'A02056', label: '관' },
    { value: 'A02057', label: '㎗' },
    { value: 'A02058', label: '㎘' },
    { value: 'A02059', label: '㎤' },
    { value: 'A02060', label: '㎥' },
    { value: 'A02061', label: 'in³' },
    { value: 'A02062', label: 'ft³' },
    { value: 'A02063', label: '㎠' },
    { value: 'A02064', label: '㎡' },
    { value: 'A02065', label: 'K' },
    { value: 'A02066', label: '개월' },
    { value: 'A02067', label: '건반' },
    { value: 'A02068', label: '극' },
    { value: 'A02069', label: '단' },
    { value: 'A02070', label: '년' },
    { value: 'A02071', label: '단서랍' },
    { value: 'A02072', label: '도어' },
    { value: 'A02073', label: '등석' },
    { value: 'A02074', label: '박스' },
    { value: 'A02075', label: '룸' },
    { value: 'A02076', label: '배속' },
    { value: 'A02077', label: '버튼' },
    { value: 'A02078', label: '볼' },
    { value: 'A02079', label: '부' },
    { value: 'A02080', label: '세' },
    { value: 'A02081', label: '세척코스' },
    { value: 'A02082', label: '셀' },
    { value: 'A02083', label: '안시' },
    { value: 'A02084', label: '음색' },
    { value: 'A02085', label: '인가족' },
    { value: 'A02086', label: '인권' },
    { value: 'A02087', label: '차식' },
    { value: 'A02088', label: '층석' },
    { value: 'A02089', label: '캔' },
    { value: 'A02090', label: '통' },
    { value: 'A02091', label: '팩' },
    { value: 'A02092', label: '픽셀' },
    { value: 'A02093', label: '핀' },
    { value: 'A02094', label: '헤드' },
    { value: 'A02095', label: 'KB' },
    { value: 'A02096', label: 'mAh' },
    { value: 'A02097', label: 'ms' },
    { value: 'A02098', label: 'nm' },
    { value: 'A02099', label: 'TB' },
    { value: 'A02100', label: 'ct' },
    { value: 'A02101', label: '부' },
    { value: 'A02102', label: '리' },
    { value: 'A02103', label: '모' },
    { value: 'A02104', label: '%' },
    { value: 'A02105', label: '분' },
    { value: 'A02106', label: '자리' },
    { value: 'A02107', label: 'MB' },
    { value: 'A02108', label: '매/min' },
    { value: 'A02109', label: '매' },
    { value: 'A02110', label: 'm/sec' },
    { value: 'A02111', label: 'ml(g)' },
    { value: 'A02112', label: 'ml' },
    { value: 'A02113', label: '초' },
    { value: 'A02115', label: '컷' },
    { value: 'A02116', label: '화음' },
    { value: 'A02117', label: 'CD' },
    { value: 'A02118', label: '채널' },
    { value: 'A02119', label: 'MB' },
    { value: 'A02120', label: '코스' },
    { value: 'A02121', label: '가지' },
    { value: 'A02122', label: 'ipm' },
    { value: 'A02123', label: 'MB/s' },
    { value: 'A02124', label: 'IOPS' },
    { value: 'A02125', label: 'Gb/s' },
    { value: 'A02126', label: 'cm(7인치급)' },
    { value: 'A02127', label: 'cm(8인치급)' },
    { value: 'A02128', label: 'cm(9인치급)' },
    { value: 'A02129', label: 'cm(10인치급)' },
    { value: 'A02130', label: 'cm(11인치급)' },
    { value: 'A02131', label: 'cm(12인치급)' },
    { value: 'A02132', label: 'cm(13인치급)' },
    { value: 'A02133', label: 'cm(15인치급)' },
    { value: 'A02134', label: 'cm(16인치급)' },
    { value: 'A02135', label: 'cm(17인치급)' },
    { value: 'A02136', label: 'cm(18인치급)' },
    { value: 'A02137', label: 'cm(14인치급)' },
    { value: 'A02138', label: 'mW' },
    { value: 'A02139', label: 'Ohms' },
    { value: 'A02140', label: '장' },
    { value: 'A02141', label: 'kcal/h' },
    { value: 'A02142', label: 'FP' },
    { value: 'A02143', label: 'kW' },
    { value: 'A02144', label: '도' },
    { value: 'A02145', label: 'mmH2O' },
    { value: 'A02146', label: '롤' },
    { value: 'A02147', label: 'hp' },
    { value: 'A02148', label: 'W/kg' },
    { value: 'A02149', label: '명' },
    { value: 'A02150', label: '종' },
    { value: 'A02151', label: 'T' },
    { value: 'A02152', label: 'Mbps' },
    { value: 'A02153', label: '인' },
    { value: 'A02154', label: '등급' },
    { value: 'A02155', label: '형' },
    { value: 'A02156', label: '중' },
    { value: 'A02157', label: 'V' },
    { value: 'A02158', label: '홀' },
    { value: 'A02159', label: 'J' },
    { value: 'A02160', label: '배율' },
    { value: 'A02161', label: '호' },
    { value: 'A02162', label: '행정' },
    { value: 'A02163', label: '베이' },
    { value: 'A02164', label: '버전' },
    { value: 'A02165', label: '회' },
    { value: 'A02166', label: '엽' },
    { value: 'A02167', label: '겹' },
    { value: 'A02168', label: '절' },
    { value: 'A02169', label: '피스' },
    { value: 'A02170', label: 'Gbps' },
    { value: 'A02171', label: 'fps' },
    { value: 'A02172', label: '륜' },
    { value: 'A02173', label: 'Hz' },
    { value: 'A02174', label: 'oz' },
    { value: 'A02175', label: 'P' },
    { value: 'A02176', label: 'Ah' },
    { value: 'A02177', label: '벌' },
    { value: 'A02178', label: 'ppi' },
    { value: 'A02179', label: 'nit' },
    { value: 'A02180', label: 'cell' },
    { value: 'A02181', label: '권' },
    { value: 'A02182', label: '페지' },
    { value: 'A02183', label: 'L' },
    { value: 'A02184', label: '대' },
    { value: 'A02185', label: 'dBi' },
    { value: 'A02186', label: '룩스' },
    { value: 'A02187', label: '코어' },
    { value: 'A02188', label: '스레드' },
    { value: 'A02189', label: '원' },
    { value: 'A02190', label: '스텝' },
    { value: 'A02191', label: '레벨' },
    { value: 'A02192', label: 'U' },
    { value: 'A02193', label: '회(분당)' },
    { value: 'A02194', label: '라인' },
    { value: 'A02195', label: 'cps' },
    { value: 'A02196', label: '칼럼' },
    { value: 'A02197', label: '콘' },
    { value: 'A02198', label: '쌍' },
    { value: 'A02199', label: 'Ω' },
    { value: 'A02200', label: 'H' },
    { value: 'A02201', label: '게인' },
    { value: 'A02202', label: 'AWG' },
    { value: 'A02203', label: 'bar' },
    { value: 'A02204', label: '슬롯' },
    { value: 'A02205', label: '마력' },
    { value: 'A02206', label: '만시간' },
    { value: 'A02207', label: 'GT' },
    { value: 'A02208', label: 'rps' },
    { value: 'A02209', label: '일' },
    { value: 'A02210', label: '주' },
    { value: 'A02211', label: 'kcal' },
    { value: 'A02212', label: '폭' },
    { value: 'A02213', label: 'aw' },
    { value: 'A02214', label: 'Pa' },
    { value: 'A02215', label: 'µgRE' },
    { value: 'A02216', label: 'mg(a-TE)' },
    { value: 'A02217', label: 'µg' },
    { value: 'A02218', label: '억 CFU' },
    { value: 'A02219', label: 'psi' },
    { value: 'A02221', label: 'CMH' },
    { value: 'A02222', label: 'm³/h' },
    { value: 'A02223', label: '℃' },
    { value: 'A02224', label: '℉' },
    { value: 'A02225', label: '루멘' },
    { value: 'A02226', label: 'Nm' },
    { value: 'A02227', label: 'spm' },
    { value: 'A02228', label: '개입' },
    { value: 'A02229', label: 'MP' },
    { value: 'A02230', label: 'km/h' },
    { value: 'A02231', label: 'kWh(월)' },
    { value: 'A02232', label: 'kWh' },
    { value: 'A02233', label: 'KPA' },
    { value: 'A02234', label: 'mm/sec' },
    { value: 'A02235', label: 'CFM' },
    { value: 'A02236', label: '켤레' },
    { value: 'A02237', label: 'TBW' },
    { value: 'A02238', label: '키' },
    { value: 'A02239', label: '칸' },
    { value: 'A02240', label: 'ps/rpm' },
    { value: 'A02241', label: 'kg.m/rpm' },
    { value: 'A02242', label: 'L/min' },
    { value: 'A02243', label: 'gsm' },
    { value: 'A02244', label: '캡슐' },
    { value: 'A02245', label: '포' },
    { value: 'A02246', label: '매입' },
    { value: 'A02247', label: '구미' },
    { value: 'A02248', label: '사이클' },
    { value: 'A02249', label: 'Wh' },
    { value: 'A02250', label: '회분' },
    { value: 'A02251', label: '정' },
    { value: 'A02252', label: 'Brix' },
    { value: 'A02253', label: '환' },
];

const ProductAttributeCard = forwardRef(
    ({ data, index, isFocused, onCardFocus, isFlipped, onFlip, onSaveSuccess, offset, limit }, ref) => {
        const cardRef = useRef(null);
        const carouselRef = useRef(null);
        const [thumbNailUrl, setThumbNailUrl] = useState([]);
        const imageSrc = data.thumbnail?.[0]?.thumbNailUrl || defaultImage;
        const [originArea, setOriginArea] = useState({});
        const [certificationList, setCertificationList] = useState([{ id: 0, certInfo: '', agency: '', number: '' }]);
        const [selectedAttributes, setSelectedAttributes] = useState([]);
        const [productInfoProvidedNoticeContents, setProductInfoProvidedNoticeContents] = useState([]);
        const [productInfoProvidedNoticeType, setProductInfoProvidedNoticeType] = useState('');
        const [productInfoProvidedNoticeTypeName, setProductInfoProvidedNoticeTypeName] = useState('');
        const [attributes, setAttributes] = useState([]);
        const [attributeValues, setAttributeValues] = useState([]);
        const [naverCategory, setNaverCategory] = useState([]);
        const [naverProductForProvidedNotice, setNaverProductForProvidedNotice] = useState([]);

        useEffect(() => {
            const urls = data.thumbnail?.map((item) => item.thumbNailUrl) || [];
            setThumbNailUrl(urls);
        }, [data, data.thumbnail]);

        useEffect(() => {
            if (naverProductForProvidedNotice && naverProductForProvidedNotice.length > 0) {
                const etcItem = naverProductForProvidedNotice.find(
                    (item) => item.productInfoProvidedNoticeType === 'ETC'
                );
                if (etcItem) {
                    setProductInfoProvidedNoticeType('ETC');
                    setProductInfoProvidedNoticeTypeName(etcItem.productInfoProvidedNoticeTypeName);
                    setProductInfoProvidedNoticeContents(etcItem.productInfoProvidedNoticeContents);
                }
            }
        }, [naverProductForProvidedNotice]);

        useEffect(() => {
            if (productInfoProvidedNoticeContents?.length > 0) {
                productInfoProvidedNoticeContents.forEach((item) => {
                    if (!item.fieldValue) {
                        let initialValue = '';
                        if (
                            item.fieldName === 'customerServicePhoneNumber' ||
                            item.fieldName === 'afterServiceDirector'
                        ) {
                            initialValue = '01035048164';
                        } else if (item.fieldName === 'manufacturer') {
                            initialValue = '인영상회 협력사';
                        } else if (item.fieldName === 'certificateDetails') {
                            initialValue = '상세페이지 참조';
                        } else if (item.fieldName === 'itemName') {
                            initialValue = data.wholeProductName;
                        } else if (item.fieldName === 'modelName') {
                            initialValue = data.wholeProductName;
                        }

                        if (initialValue) {
                            updateProductInfoProvidedNoticeContents(
                                item.fieldName,
                                initialValue,
                                productInfoProvidedNoticeType
                            );
                        }
                    }
                });
            }
        }, [productInfoProvidedNoticeContents]);

        const handleNextSlide = async () => {
            const categoryNum = data.naverCategoryNum;

            let tempAttributes = [],
                tempAttributeValues = [],
                tempNaverCategory = [],
                tempNaverProductForProvidedNotice = [];

            try {
                tempAttributes = await getProductAttributes(categoryNum);
                console.log('tempAttributes****************************', tempAttributes);
            } catch (error) {
                console.log('상품 속성 조회 실패:', error);
            }

            try {
                tempAttributeValues = await getProductAttributeValues(categoryNum);
                console.log('tempAttributeValues****************************', tempAttributeValues);
            } catch (error) {
                console.log('상품 속성값 조회 실패:', error);
            }

            try {
                tempNaverCategory = await getNaverCategory(categoryNum);
            } catch (error) {
                console.log('네이버 카테고리 조회 실패:', error);
            }

            try {
                tempNaverProductForProvidedNotice = await getNaverProductForProvidedNotice(categoryNum);
            } catch (error) {
                console.log('네이버 상품 제공 공지 조회 실패:', error);
            }

            setAttributes(tempAttributes);
            setAttributeValues(tempAttributeValues);
            setNaverCategory(tempNaverCategory);
            setNaverProductForProvidedNotice(tempNaverProductForProvidedNotice);

            setTimeout(() => {
                carouselRef.current.next();
                onFlip();
            }, 0);
        };

        useImperativeHandle(ref, () => ({
            focusInput: () => {
                cardRef.current?.focus();
            },
        }));

        const handleFocus = () => {
            if (!isFocused) {
                onCardFocus();
            }
        };

        const updateProductInfoProvidedNoticeContents = (fieldName, value) => {
            setProductInfoProvidedNoticeContents((prev) => {
                return prev.map((item) => {
                    if (item.fieldName === fieldName) {
                        let formattedValue = value;
                        switch (item.fieldType) {
                            case 'Boolean':
                                formattedValue = String(value);
                                break;
                            case 'YearMonth':
                                formattedValue = value ? value : '';
                                break;
                            case 'LocalDate':
                                formattedValue = value ? value : '';
                                break;
                            default:
                                formattedValue = value || '';
                        }

                        return {
                            ...item,
                            fieldValue: formattedValue,
                            productInfoProvidedNoticeType: productInfoProvidedNoticeType,
                            productInfoProvidedNoticeTypeName: productInfoProvidedNoticeTypeName,
                        };
                    }
                    return item;
                });
            });
        };

        const renderField = (item, index) => {
            const commonProps = {
                key: index,
                className: 'attribute-input-group',
            };

            const label = (
                <Text>
                    {item.fieldDescription}
                    {item.fieldAddDescription ? ` - ${item.fieldAddDescription}` : ''}
                </Text>
            );

            switch (item.fieldType) {
                case 'String':
                    return (
                        <div {...commonProps}>
                            {label}
                            <Input
                                value={item.fieldValue || ''}
                                onChange={(e) =>
                                    updateProductInfoProvidedNoticeContents(
                                        item.fieldName,
                                        e.target.value,
                                        productInfoProvidedNoticeType
                                    )
                                }
                                placeholder={item.fieldDescription}
                            />
                        </div>
                    );

                case 'YearMonth':
                    return (
                        <div {...commonProps}>
                            {label}
                            <DatePicker
                                picker="month"
                                value={item.fieldValue ? dayjs(item.fieldValue) : null}
                                onChange={(date) => {
                                    const formattedDate = date ? date.format('YYYY-MM') : null;
                                    updateProductInfoProvidedNoticeContents(
                                        item.fieldName,
                                        formattedDate,
                                        productInfoProvidedNoticeType
                                    );
                                }}
                                style={{ width: '100%' }}
                                placeholder="연월 선택"
                            />
                        </div>
                    );

                case 'LocalDate':
                    return (
                        <div {...commonProps}>
                            {label}
                            <DatePicker
                                placeholder="날짜 선택"
                                style={{ width: '100%' }}
                                value={item.fieldValue ? dayjs(item.fieldValue) : null}
                                onChange={(date) => {
                                    const formattedDate = date ? date.format('YYYY-MM-DD') : null;
                                    updateProductInfoProvidedNoticeContents(
                                        item.fieldName,
                                        formattedDate,
                                        productInfoProvidedNoticeType
                                    );
                                }}
                            />
                        </div>
                    );

                case 'Boolean':
                    return (
                        <div {...commonProps}>
                            {label}
                            <Checkbox
                                checked={item.fieldValue === 'true'}
                                onChange={(e) =>
                                    updateProductInfoProvidedNoticeContents(item.fieldName, e.target.checked)
                                }
                            />
                        </div>
                    );
            }
        };

        const renderProductInfoProvidedNoticeContents = (data) => {
            if (!data?.length) return null;
            return data.map((item, index) => renderField(item, index));
        };

        const renderNaverProductForProvidedNotice = () => {
            const options = [];
            naverProductForProvidedNotice.forEach((item) => {
                options.push({
                    label: item.productInfoProvidedNoticeTypeName,
                    value: item.productInfoProvidedNoticeType,
                });
            });

            // naverProductForProvidedNotice가 로드되지 않았다면 렌더링하지 않음
            if (!naverProductForProvidedNotice || naverProductForProvidedNotice.length === 0) {
                return null;
            }

            return (
                <Select
                    style={{ width: '100%' }}
                    placeholder="네이버 제공 정보 선택"
                    options={options}
                    value={productInfoProvidedNoticeType || 'ETC'} // defaultValue 대신 value 사용
                    onChange={(value) => {
                        const selectedItem = naverProductForProvidedNotice.find(
                            (item) => item.productInfoProvidedNoticeType === value
                        );
                        setProductInfoProvidedNoticeType(value);
                        setProductInfoProvidedNoticeTypeName(selectedItem.productInfoProvidedNoticeTypeName);
                        setProductInfoProvidedNoticeContents(selectedItem.productInfoProvidedNoticeContents);
                    }}
                />
            );
        };

        const renderAttributeField = (attributes, attributeValues) => {
            if (!Array.isArray(attributes) || attributes.length === 0) {
                console.log('유효하지 않은 attributes:', attributes);
                return null;
            }

            if (!attributeValues || Object.keys(attributeValues).length === 0) {
                console.log('유효하지 않은 attributeValues:', attributeValues);
                return null;
            }

            return attributes.map((attribute, index) => {
                const currentAttributeValues = attributeValues[attribute.attributeSeq];

                if (!currentAttributeValues) {
                    console.log(`attribute ${index}에 대한 values가 없음`);
                    return null;
                }

                if (attribute.attributeClassificationType === 'MULTI_SELECT') {
                    const options =
                        currentAttributeValues?.map((value) => ({
                            label: value.minAttributeValue,
                            value: value.attributeValueSeq,
                        })) || [];

                    return (
                        <div key={attribute.attributeId} className="attribute-field">
                            <p className="data-title">
                                {index + 1}.{attribute.attributeName}
                            </p>
                            <Checkbox.Group
                                value={
                                    selectedAttributes
                                        .filter((attr) => attr.attributeSeq === attribute.attributeSeq)
                                        .map((attr) => attr.attributeValueSeq) || []
                                }
                                onChange={(values) => {
                                    setSelectedAttributes((prev) => {
                                        if (values.length === 0) {
                                            return prev.filter((attr) => attr.attributeSeq !== attribute.attributeSeq);
                                        }

                                        const newAttributes = values.map((value) => ({
                                            attributeSeq: attribute.attributeSeq,
                                            attributeName: attribute.attributeName,
                                            attributeValueSeq: value,
                                            minAttributeValue: options.find((option) => option.value === value)?.label,
                                        }));

                                        return [
                                            ...prev.filter((attr) => attr.attributeSeq !== attribute.attributeSeq),
                                            ...newAttributes,
                                        ];
                                    });
                                }}
                            >
                                <Row gutter={[8, 8]}>
                                    {options.map((option) => (
                                        <Col span={5} key={option.value}>
                                            <Checkbox value={option.value}>{option.label}</Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                        </div>
                    );
                } else if (attribute.attributeClassificationType === 'SINGLE_SELECT') {
                    const options =
                        currentAttributeValues?.map((value) => ({
                            label: value.minAttributeValue,
                            value: value.attributeValueSeq,
                        })) || [];

                    return (
                        <div key={attribute.attributeId} className="attribute-field">
                            <p className="data-title">
                                {index + 1}.{attribute.attributeName}
                            </p>
                            <Select
                                style={{ width: '100%' }}
                                placeholder={`${attribute.attributeName} 선택`}
                                options={[{ label: `${attribute.attributeName} 선택`, value: '' }, ...options]}
                                value={
                                    selectedAttributes.find((attr) => attr.attributeSeq === attribute.attributeSeq)
                                        ?.attributeValueSeq
                                }
                                onChange={(value) => {
                                    setSelectedAttributes((prev) => {
                                        if (!value) {
                                            return prev.filter((attr) => attr.attributeSeq !== attribute.attributeSeq);
                                        }

                                        const newAttribute = {
                                            attributeSeq: attribute.attributeSeq,
                                            attributeValueSeq: value,
                                            attributeName: attribute.attributeName,
                                            minAttributeValue: options.find((option) => option.value === value)?.label,
                                            unit: '',
                                        };

                                        return [
                                            ...prev.filter((attr) => attr.attributeSeq !== attribute.attributeSeq),
                                            newAttribute,
                                        ];
                                    });
                                }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    );
                } else if (attribute.attributeClassificationType === 'RANGE') {
                    return (
                        <div key={attribute.attributeId} className="attribute-field">
                            <p className="data-title">
                                {index + 1}.{attribute.attributeName}
                            </p>
                            <Select
                                style={{ width: '200px', marginRight: '10px' }}
                                placeholder="범위 선택"
                                options={[
                                    { label: '범위 선택', value: '' },
                                    ...generateRangeOptions(attribute.attributeSeq),
                                ]}
                                value={
                                    selectedAttributes.find((attr) => attr.attributeSeq === attribute.attributeSeq)
                                        ?.attributeValueSeq
                                }
                                onChange={(value) => {
                                    setSelectedAttributes((prev) => {
                                        const existingAttr = prev.find(
                                            (attr) => attr.attributeSeq === attribute.attributeSeq
                                        );
                                        if (!existingAttr) {
                                            return [
                                                ...prev,
                                                {
                                                    attributeSeq: attribute.attributeSeq,
                                                    attributeName: attribute.attributeName,
                                                    attributeValueSeq: value,
                                                    minAttributeValue: '',
                                                    unit: '',
                                                },
                                            ];
                                        }
                                        return prev.map((attr) =>
                                            attr.attributeSeq === attribute.attributeSeq
                                                ? {
                                                      ...attr,
                                                      attributeValueSeq: value,
                                                  }
                                                : attr
                                        );
                                    });
                                }}
                            />
                            <InputNumber
                                style={{ width: '200px', marginRight: '10px' }}
                                value={
                                    selectedAttributes.find((attr) => attr.attributeSeq === attribute.attributeSeq)
                                        ?.minAttributeValue
                                }
                                onChange={(inputValue) => {
                                    setSelectedAttributes((prev) => {
                                        const existingAttr = prev.find(
                                            (attr) => attr.attributeSeq === attribute.attributeSeq
                                        );
                                        if (!inputValue) {
                                            return prev.filter((attr) => attr.attributeSeq !== attribute.attributeSeq);
                                        }

                                        const newAttribute = {
                                            attributeSeq: attribute.attributeSeq,
                                            attributeName: attribute.attributeName,
                                            attributeValueSeq: existingAttr?.attributeValueSeq || '',
                                            minAttributeValue: inputValue,
                                            unit: existingAttr?.unit || '',
                                        };

                                        return existingAttr
                                            ? prev.map((attr) =>
                                                  attr.attributeSeq === attribute.attributeSeq ? newAttribute : attr
                                              )
                                            : [...prev, newAttribute];
                                    });
                                }}
                            />
                            <Select
                                style={{ width: '200px' }}
                                placeholder={`단위 선택`}
                                showSearch
                                options={naverUnitList}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                value={
                                    selectedAttributes.find((attr) => attr.attributeSeq === attribute.attributeSeq)
                                        ?.unit
                                }
                                onChange={(unitValue, option) => {
                                    setSelectedAttributes((prev) => {
                                        const existingAttr = prev.find(
                                            (attr) => attr.attributeSeq === attribute.attributeSeq
                                        );

                                        if (!existingAttr) {
                                            return [
                                                ...prev,
                                                {
                                                    attributeSeq: attribute.attributeSeq,
                                                    attributeName: attribute.attributeName,
                                                    attributeValueSeq: '',
                                                    minAttributeValue: '',
                                                    unit: unitValue,
                                                },
                                            ];
                                        }

                                        return prev.map((attr) =>
                                            attr.attributeSeq === attribute.attributeSeq
                                                ? {
                                                      ...attr,
                                                      unit: unitValue,
                                                  }
                                                : attr
                                        );
                                    });
                                }}
                            />
                        </div>
                    );
                }
                return null;
            });
        };

        const generateRangeOptions = (attributeSeq) => {
            const options = attributeValues[attributeSeq] || [];

            // unit이 없는 경우를 처리
            return options.map((value) => {
                const unit = naverUnitList.find((item) => item.value === value.maxAttributeValueUnitCode) || {
                    label: '',
                };

                return {
                    label:
                        (value.minAttributeValue ? value.minAttributeValue + ' ' + unit.label : '') +
                        (value.maxAttributeValue ? ' ~ ' + value.maxAttributeValue + ' ' + unit.label : ''),
                    value: value.attributeValueSeq,
                };
            });
        };

        const renderNaverCategory = (naverCategory, onChangeCallback) => {
            const certificationInfos = naverCategory.certificationInfos;
            const selectOptions = [];
            if (certificationInfos) {
                certificationInfos.forEach((item) => {
                    selectOptions.push({ label: item.name, value: item.id });
                });
            }
            return (
                <>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="네이버 인증 정보 선택"
                        options={[{ label: '네이버 인증 정보 선택', value: '' }, ...selectOptions]}
                        value={certificationList[0]?.certInfo || ''}
                        showSearch
                        onChange={(value) => {
                            const selectedOption = selectOptions.find((option) => option.value === value);
                            onChangeCallback(value, selectedOption?.label);
                        }}
                    />
                </>
            );
        };

        const addCertification = () => {
            setCertificationList([
                ...certificationList,
                {
                    id: certificationList.length,
                    certInfo: '',
                    agency: '',
                    number: '',
                },
            ]);
        };

        const removeCertification = (id) => {
            if (certificationList.length > 1) {
                setCertificationList(certificationList.filter((cert) => cert.id !== id));
            }
        };

        const updateCertification = (id, field, value, label) => {
            setCertificationList(
                certificationList.map((cert) => {
                    if (cert.id === id) {
                        if (field === 'certInfo') {
                            return {
                                ...cert,
                                [field]: value,
                                certInfoName: label,
                            };
                        }
                        return { ...cert, [field]: value };
                    }
                    return cert;
                })
            );
        };

        const handlePrevSlide = () => {
            carouselRef.current.prev();
            onFlip();
        };

        useEffect(() => {
            if (!isFlipped && carouselRef.current) {
                carouselRef.current.goTo(0);
            }
        }, [isFlipped]);

        // 모든 상태값 초기화하는 함수
        const resetAllStates = () => {
            // 기본 상태값 초기화
            setCertificationList([{ id: 0, certInfo: '', agency: '', number: '' }]);
            setSelectedAttributes([]);
            setOriginArea({ originNation: '', originNationName: '', originArea: '' });
            setProductInfoProvidedNoticeContents([]);
            setProductInfoProvidedNoticeType('');
            setProductInfoProvidedNoticeTypeName('');
            setAttributes([]);
            setAttributeValues([]);
            setNaverCategory([]);
            setNaverProductForProvidedNotice([]);
        };

        // 포커스가 변경될 때 초기화
        useEffect(() => {
            if (isFocused) {
                resetAllStates();
            }
        }, [isFocused]);

        const handleSave = async () => {
            const params = {
                wholesaleProductId: data.wholesaleProductId,
                certificationList,
                selectedAttributes,
                originArea,
                productInfoProvidedNoticeContents,
            };
            const result = await postProductAttribute(params);
            if (result.success) {
                message.success('상품 속성 저장 완료');

                // 저장 성공 후 상태값 초기화
                resetAllStates();

                // 첫 번째 슬라이드로 돌아가기
                if (carouselRef.current) {
                    carouselRef.current.goTo(0);
                }
                onFlip(false);
                onSaveSuccess(data.wholesaleProductId);
            } else {
                message.error('상품 속성 저장 실패');
            }
        };

        return (
            <Card
                ref={cardRef}
                hoverable
                size="small"
                tabIndex={0}
                onFocus={handleFocus}
                className="product-card"
                style={{
                    width: '100%',
                    border: isFocused ? '2px solid #1890ff' : '1px solid #d9d9d9',
                }}
                actions={[
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '16px' }}>
                        <Button type="primary" onClick={handleSave}>
                            속성 저장
                        </Button>
                    </div>,
                ]}
                title={`${index + 1 + offset - limit}번 상품 ${data.wpaWholesaleProductId ? '속성 적용' : '속성 미적용'}`}
            >
                <Carousel ref={carouselRef} dots={false}>
                    <div className="product-info-slide">
                        <div className="product-content">
                            <Image.PreviewGroup items={thumbNailUrl.length > 0 ? thumbNailUrl : [defaultImage]}>
                                <div className="product-header">
                                    <Image width={150} src={imageSrc} fallback={defaultImage} alt="Product Image" />
                                    <div className="product-details">
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
                                        <Divider className="divider" />
                                        <Row className="table-row" gutter={[4, 1]}>
                                            <Col span={5}>
                                                <p className="data-title">판매 가격</p>
                                            </Col>
                                            <Col span={1}>
                                                <p className="data-title">:</p>
                                            </Col>
                                            <Col span={6}>
                                                <p className="data-content">{formatKRW(data.productPrice)}원</p>
                                            </Col>
                                            <Col span={5}>
                                                <p className="data-title">검색어</p>
                                            </Col>
                                            <Col span={1}>
                                                <p className="data-title">:</p>
                                            </Col>
                                            <Col span={6}>
                                                <p className="data-content">{data.searchWord}</p>
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
                                    </div>
                                </div>
                            </Image.PreviewGroup>
                        </div>
                        <div className="action-buttons">
                            <Button type="primary" onClick={handleNextSlide}>
                                속성 작성하기
                            </Button>
                        </div>
                    </div>

                    <div className="attribute-slide">
                        <div className="attribute-content">
                            <>
                                <div className="attribute-container-title">
                                    <p className="data-title">속성 입력</p>
                                </div>
                                {attributes.length > 0 && Object.keys(attributeValues).length > 0 ? (
                                    renderAttributeField(attributes, attributeValues)
                                ) : (
                                    <Empty />
                                )}
                                <Divider className="divider" />
                                <div className="attribute-container-title">
                                    <p className="data-title">원산지 입력</p>
                                </div>
                                <Row className="table-row" gutter={[4, 1]}>
                                    <Col span={6}>
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder="국산/수입산 선택"
                                            value={originArea.originNation || ''}
                                            options={[
                                                { label: '국산/수입산 선택', value: '' },
                                                { label: '국산', value: 'domestic' },
                                                { label: '수입산', value: 'imported' },
                                            ]}
                                            onChange={(value) => {
                                                const defaultArea =
                                                    value === 'domestic'
                                                        ? '국내산 제품'
                                                        : value === 'imported'
                                                          ? '중국산 제품'
                                                          : '';
                                                setOriginArea({
                                                    ...originArea,
                                                    originNation: value,
                                                    originNationName:
                                                        value === 'domestic'
                                                            ? '국산'
                                                            : value === 'imported'
                                                              ? '수입산'
                                                              : '',
                                                    originArea: defaultArea,
                                                });
                                            }}
                                        />
                                    </Col>
                                    <Col span={10}>
                                        <Input
                                            placeholder="생산지 입력"
                                            value={originArea.originArea || ''}
                                            onChange={(e) =>
                                                setOriginArea({ ...originArea, originArea: e.target.value })
                                            }
                                        />
                                    </Col>
                                </Row>
                                <Divider className="divider" />
                                <div className="attribute-container-title">
                                    <Row justify="space-between" align="middle">
                                        <Col>
                                            <p className="data-title">네이버 인증 정보</p>
                                        </Col>
                                        <Col>
                                            <Button
                                                type="dashed"
                                                icon={<PlusOutlined />}
                                                onClick={addCertification}
                                                size="small"
                                                style={{
                                                    borderColor: '#1890ff',
                                                    color: '#1890ff',
                                                }}
                                            >
                                                인증 정보 추가
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                                {certificationList.map((cert) => (
                                    <Row className="table-row" gutter={[4, 8]} key={cert.id}>
                                        <Col span={6}>
                                            <div className="attribute-input-group">
                                                <Text type="secondary">인증 정보</Text>
                                                {renderNaverCategory(naverCategory, (value, label) =>
                                                    updateCertification(cert.id, 'certInfo', value, label)
                                                )}
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className="attribute-input-group">
                                                <Text type="secondary">인증 기관</Text>
                                                <Input
                                                    placeholder="인증 기관 입력"
                                                    value={cert.agency}
                                                    onChange={(e) =>
                                                        updateCertification(cert.id, 'agency', e.target.value)
                                                    }
                                                />
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className="attribute-input-group">
                                                <Text type="secondary">인증 번호</Text>
                                                <Input
                                                    placeholder="인증 번호 입력"
                                                    value={cert.number}
                                                    onChange={(e) =>
                                                        updateCertification(cert.id, 'number', e.target.value)
                                                    }
                                                />
                                            </div>
                                        </Col>
                                        <Col span={2} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Button
                                                type="text"
                                                danger
                                                icon={<MinusOutlined />}
                                                onClick={() => removeCertification(cert.id)}
                                                disabled={certificationList.length === 1}
                                            />
                                        </Col>
                                    </Row>
                                ))}
                                <Divider className="divider" />
                                <Row>
                                    <Col span={24}>
                                        <div className="attribute-input-group">
                                            <Text type="secondary">제공 정보</Text>
                                            {renderNaverProductForProvidedNotice()}
                                            <Divider className="divider" style={{ margin: '16px 0' }} />
                                            {renderProductInfoProvidedNoticeContents(productInfoProvidedNoticeContents)}
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        </div>
                        <div className="action-buttons">
                            <Button type="primary" onClick={handlePrevSlide}>
                                상품 정보 보기
                            </Button>
                        </div>
                    </div>
                </Carousel>
            </Card>
        );
    }
);

export default ProductAttributeCard;
