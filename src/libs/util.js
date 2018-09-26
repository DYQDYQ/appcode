import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title : '智慧建造平台';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'http://192.168.100.113:8080' :
    env === 'production' ?
    'https://www.url.com' :
    'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});
export default util;