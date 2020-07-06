import './index.less';
const viewObj = () => {
    console.log({
        1: '111333'
    });
};

viewObj();

const getData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(223344);
        }, 1000);
    });
};

getData().then(res => {
    console.info(res);
});