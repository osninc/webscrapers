export const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

export const sqft2acre = num => {
    return parseFloat((num / 43560).toFixed(2));
}