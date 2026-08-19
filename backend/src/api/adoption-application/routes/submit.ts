export default {
  routes: [
    {
      method: 'POST',
      path: '/adoption-applications/submit',
      handler: 'adoption-application.submit',
      config: {
        auth: false,
      },
    },
  ],
};
