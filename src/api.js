import axios from 'axios';
import mockRequsts from './mocks/mockRequsts';
import { API_ROUTES, isMock } from './configs/api';

/**
 * @var {Axios}
 */
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

if (isMock) {
  // мокаем запросы для routes
  mockRequsts(axios, instance, { routes: Object.values(API_ROUTES) });
}

/**
 * Load payments data.
 *
 * @param {Object} params
 * @returns {Promise}
 */
const getPayments = (params = {}) => instance.request({
  method: 'get',
  url: API_ROUTES.GET_PAYMENTS,
  params,
});

export default {
  instance,
  getPayments,
};
