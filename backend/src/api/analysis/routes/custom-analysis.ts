export default {
  routes: [
    {
      method: 'GET',
      path: '/analysis/summary',
      handler: 'analysis.summary',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
  ],
};
