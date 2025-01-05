export const resetScroll = (containerSelector) => {
    const container = document.querySelector(containerSelector);
    if (container) {
        container.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
};
