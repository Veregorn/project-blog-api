// Function to decode the image URL
function decodeImageUrl(imageURL) {
    const entities = {
        '&%23x2F;': '/',
        '&#x2F;': '/',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
    };
    return imageURL.replace(/&%23x2F;|&#x2F;|&amp;|&lt;|&gt;|&quot;|&#39;/g, function (match) {
        return entities[match];
    });
};

export default decodeImageUrl;