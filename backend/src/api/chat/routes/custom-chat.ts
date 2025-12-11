export default {
  routes: [
    {
      method: 'POST',
      path: '/chat',
      handler: 'chat.respond',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
  ],
};
