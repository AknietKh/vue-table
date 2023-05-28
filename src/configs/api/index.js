export const isMock = JSON.parse(process.env.VUE_APP_IS_MOCK ?? false);
export const API_ROUTES = {
  GET_PAYMENTS: '/api/v1/payments',
};
