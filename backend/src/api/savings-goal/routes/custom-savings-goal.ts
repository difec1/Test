export default {
  routes: [
    {
      method: 'POST',
      path: '/goals/fromText',
      handler: 'savings-goal.fromText',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
    {
      method: 'GET',
      path: '/goals/user',
      handler: 'savings-goal.userGoals',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
  ],
};
