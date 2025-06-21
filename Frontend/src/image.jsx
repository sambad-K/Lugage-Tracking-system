import React from 'react';

const ImageComponent = ({ src, alt, width }) => {
    return <img src={src} alt={alt} width={width} />;
};

export default ImageComponent;
