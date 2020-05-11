import Cookies from 'js-cookie';
import { forEach, hasOneOf, objEqual } from '@/libs/tools';
import config from '@/config';
const { title, cookieExpires, useI18n, tokenKey } = config;

/**
 * 
 * @description Cookies 方式存储
 */
export const setToken = (token) => {
    Cookies.set(tokenKey, token, { expires: cookieExpires || 1 });
};

export const getToken = () => {
    const token = Cookies.get(tokenKey);
    if (token) return token;
    else return false;
};

/**
 * @description 本地存储和获取标签导航列表 import: localStorage 可以直接.属性名赋值
 */
export const setTagNavListInLocalstorage = (list) => {
    localStorage.tagNaveList = JSON.stringify(list);
};

/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
    const list = localStorage.tagNaveList;
    return list ? JSON.parse(list) : [];
};

export const localSave = (key, value) => {
    localStorage.setItem(key, value);
};

export const localRead = (key) => {
    return localStorage.getItem(key) || '';
};

export const showTitle = (item, vm) => {
    let { title, __titleIsFunction__ } = item.meta;
    if (!title) return;
    if (useI18n) {
        if (title.includes('{{') && title.includes('}}') && useI18n)
            title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())));
        else if (__titleIsFunction__) title = item.meta.title;
        else title = vm.$t(item.name);
    } else title = (item.meta && item.meta.title) || item.name;
    return title;
};

export const findNodeUpperByClasses = (ele, classes) => {
    let parentNode = ele.parentNode;
    if (parentNode) {
        let classList = parentNode.classList;
        if (classList && classes.every((className) => classList.contains(className))) {
            return parentNode;
        } else {
            return findNodeUpperByClasses(parentNode, classes);
        }
    }
};

export const hasChild = (item) => {
    return item.children && item.children.length !== 0;
};

const showThisMenuEle = (item, access) => {
    if (item.meta && item.meta.access && item.meta.access.length) {
        if (hasOneOf(item.meta.access, access)) return true;
        else return false;
    } else return true;
};

/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
    let res = [];
    forEach(list, (item) => {
        if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
            let obj = {
                icon: (item.meta && item.meta.icon) || '',
                name: item.name,
                meta: item.meta,
            };
            if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
                obj.children = getMenuByRouter(item.children, access);
            }
            if (item.meta && item.meta.href) obj.href = item.meta.href;
            if (showThisMenuEle(item, access)) res.push(obj);
        }
    });
    return res;
};

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
    let homeItem = { ...homeRoute, icon: homeRoute.meta.icon };
    let routeMetched = route.matched;
    if (routeMetched.some((item) => item.name === homeRoute.name)) return [homeItem];
    let res = routeMetched
        .filter((item) => {
            return item.meta === undefined || !item.meta.hideInBread;
        })
        .map((item) => {
            let meta = { ...item.meta };
            if (meta.title && typeof meta.title === 'function') {
                meta.__titleIsFunction__ = true;
                meta.title = meta.title(route);
            }
            let obj = {
                icon: (item.meta && item.meta.icon) || '',
                name: item.name,
                meta: meta,
            };
            return obj;
        });
    res = res.filter((item) => {
        return !item.meta.hideInMenu;
    });
    return [{ ...homeItem, to: homeRoute.path }, ...res];
};

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
    const params1 = route1.params || {};
    const params2 = route2.params || {};
    const query1 = route1.query || {};
    const query2 = route2.query || {};
    return route1.name === route2.name && objEqual(params1, params2) && objEqual(query1, query2);
};

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
    let i = -1;
    let len = routers.length;
    let homeRoute = {};
    while (++i < len) {
        let item = routers[i];
        if (item.children && item.children.length) {
            let res = getHomeRoute(item.children, homeName);
            if (res.name) return res;
        } else {
            if (item.name === homeName) homeRoute = item;
        }
    }
    return homeRoute;
};

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
    let res = {};
    if (list.length === 2) {
        res = getHomeRoute(list);
    } else {
        const index = list.findIndex((item) => routeEqual(item, route));
        if (index === list.length - 1) res = list[list.length - 2];
        else res = list[index + 1];
    }
    return res;
};

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
    const { name, path, meta } = newRoute;
    let newList = [...list];
    if (newList.findIndex((item) => item.name === name) >= 0) return newList;
    else newList.push({ name, path, meta });
    return newList;
};

export const getRouteTitleHandled = (route) => {
    let router = { ...route };
    let meta = { ...route.meta };
    let title = '';
    if (meta.title) {
        if (typeof meta.title === 'function') {
            meta.__titleIsFunction__ = true;
            title = meta.title(router);
        } else title = meta.title;
    }
    meta.title = title;
    router.meta = meta;
    return router;
};

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
    let i = -1;
    while (++i < times) {
        callback(i);
    }
};

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
    let len = tagNavList.length;
    let res = false;
    doCustomTimes(len, (index) => {
        if (routeEqual(tagNavList[index], routeItem)) res = true;
    });
    return res;
};

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame =
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil((difference / duration) * 50);

    const scroll = (start, end, step) => {
        if (start === end) {
            endCallback && endCallback();
            return;
        }

        let d = start + step > end ? end : start + step;
        if (start > end) {
            d = start - step < end ? end : start - step;
        }

        if (el === window) {
            window.scrollTo(d, d);
        } else {
            el.scrollTop = d;
        }
        window.requestAnimationFrame(() => scroll(d, end, step));
    };
    scroll(from, to, step);
};