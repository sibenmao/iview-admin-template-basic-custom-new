export default {
    state: {
        unreadCount: 0,
        avatarImgPath: '',
    },
    mutations: {
        setAvatar(state, avatarPath) {
            state.avatarImgPath = avatarPath;
        },
        setMessageCount(state, count) {
            state.unreadCount = count;
        },
    },
};
