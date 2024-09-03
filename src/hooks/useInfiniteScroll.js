import { throttle } from 'lodash';
import { useState, useEffect, useCallback } from 'react';

const useInfiniteScroll = (hasMore, externalLoading) => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleScroll = useCallback(
        throttle(() => {
            const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
            const threshold = document.documentElement.scrollHeight * 0.5;

            if (scrollPosition >= threshold && !loading && hasMore) {
                setPage((prevPage) => prevPage + 1);
                setLoading(true);
            }
        }, 300), // 300ms 쓰로틀 적용
        [loading, hasMore]
    );

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return { page, setPage, setLoading };
};

export default useInfiniteScroll;
