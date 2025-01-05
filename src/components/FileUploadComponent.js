import { useState, useEffect } from 'react';
import { Upload, Button, message, Space, Image, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const FileUploadComponent = ({
    onUpload, // 부모 컴포넌트에서 처리할 업로드 함수
    maxFileCount = 10, // 최대 업로드 가능한 파일 수
    title = '이미지 업로드',
    buttonText = '이미지 선택',
    maxSize = 5,
    imageSize = 150,
}) => {
    const [fileList, setFileList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = async ({ fileList: newFileList }) => {
        // 파일 크기 제한 (예: 5MB)
        const isLt5M = newFileList.every((file) => !file.size || file.size / 1024 / 1024 < maxSize);

        if (!isLt5M) {
            message.error(`이미지는 ${maxSize}MB보다 작아야 합니다`);
            return;
        }

        // 각 파일에 대해 미리보기 URL 즉시 생성
        const updatedFileList = await Promise.all(
            newFileList.map(async (file) => {
                const newFile = { ...file };

                if (newFile.originFileObj) {
                    try {
                        const base64 = await getBase64(newFile.originFileObj);
                        newFile.url = base64;
                        newFile.thumbUrl = base64;
                    } catch (error) {
                        console.error('이미지 미리보기 생성 오류:', error);
                    }
                }
                return newFile;
            })
        );

        setFileList(updatedFileList);
    };

    const handleModalOk = () => {
        onUpload(fileList);
        setIsModalOpen(false);
    };

    const handleModalCancel = () => {
        setFileList([]);
        setIsModalOpen(false);
    };

    const uploadProps = {
        beforeUpload: (file) => {
            // 이미지 파일 타입 검사
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('이미지 파일만 업로드 가능합니다!');
                return Upload.LIST_IGNORE;
            }
            return false; // 자동 업로드 방지
        },
        onChange: handleChange,
        multiple: true,
        fileList,
        listType: 'picture',
        maxCount: maxFileCount, // 최대 업로드 가능한 이미지 수
    };

    // 컴포넌트가 언마운트될 때 URL 정리
    useEffect(() => {
        return () => {
            fileList.forEach((file) => {
                // 혹시 blob URL을 사용한다면 revokeObjectURL을 해주어야 메모리 누수 방지 가능
                // (지금 코드는 FileReader base64 방식을 사용하므로 필요 없어도 무방)
                if (file.url && file.url.startsWith('blob:')) {
                    URL.revokeObjectURL(file.url);
                }
            });
        };
    }, [fileList]);

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>이미지 업로드</Button>

            <Modal
                title={title}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={800}
                okText="저장"
                cancelText="취소"
                okButtonProps={{ disabled: fileList.length === 0 }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>이미지 선택</Button>
                    </Upload>

                    {fileList.length > 0 && (
                        <Image.PreviewGroup>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {fileList.map((file) => (
                                    <Image
                                        key={file.uid}
                                        src={file.url || file.thumbUrl}
                                        alt={file.name}
                                        style={{ width: 150, height: 150, objectFit: 'cover' }}
                                    />
                                ))}
                            </div>
                        </Image.PreviewGroup>
                    )}
                </Space>
            </Modal>
        </>
    );
};
