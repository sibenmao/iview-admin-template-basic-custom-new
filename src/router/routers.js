import Main from '@/components/main';
import parentView from '@/components/parent-view';

export default [
    {
        path: '/',
        name: '_home',
        redirect: '/home',
        component: Main,
        meta: {
            hideInMenu: true,
            notCache: true,
        },
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {
                    hideInMenu: true,
                    title: '首页',
                    notCache: true,
                    icon: 'md-home',
                },
                component: () => import('@/views/single-page/home'),
            },
        ],
    },
    {
        path: '/template',
        name: 'template',
        meta: {
            icon: 'logo-buffer',
            title: '模板管理',
        },
        component: Main,
        children: [
            {
                path: 'template_curd',
                name: 'template_curd',
                meta: {
                    icon: 'ios-sunny',
                    title: '增删改查',
                },
                component: () => import('@/views/template/curd'),
            },
            {
                path: 'template_table',
                name: 'template_table',
                meta: {
                    icon: 'md-grid',
                    title: '表格模板',
                },
                component: () => import('@/views/template/table'),
            },
            {
                path: 'template_form',
                name: 'template_form',
                meta: {
                    icon: 'md-grid',
                    title: '表单模板',
                },
                component: () => import('@/views/template/form'),
            }
        ]
    },
    {
        path: '/test',
        name: 'test',
        meta: {
            icon: 'ios-beaker-outline',
            title: '测试管理',
        },
        component: Main,
        children: [
            {
                path: 'test_record',
                name: 'test_record',
                meta: {
                    icon: 'ios-recording',
                    title: '测试记录',
                },
                component: () => import('@/views/test/record'),
            },
            {
                path: 'test_current',
                name: 'test_current',
                meta: {
                    icon: 'ios-bicycle',
                    title: '当前测试',
                },
                component: () => import('@/views/test/current'),
            }
        ]
    },
    // {
    //     path: '/wheel',
    //     name: 'wheel',
    //     meta: {
    //         icon: 'logo-buffer',
    //         title: '轮子管理',
    //     },
    //     component: Main,
    //     children: [
    //         {
    //             path: 'wheel_betterScroll',
    //             name: 'wheel_betterScroll',
    //             meta: {
    //                 icon: 'ios-sunny',
    //                 title: 'M 端滚动',
    //             },
    //             component: () => import('@/views/wheel/better-scroll'),
    //         }
    //     ]
    // },
];