export default {
  routes: [
    {
      method: 'POST',
      path: '/transactions/analyzeAndCreate',
      handler: 'transaction.analyzeAndCreate',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
    {
      method: 'GET',
      path: '/transactions/user',
      handler: 'transaction.userTransactions',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
  ],
};
