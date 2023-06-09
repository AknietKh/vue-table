import getPayments from './getPayments';
import { API_ROUTES } from '../configs/api';

const DEFUALT_CANCEL_MESSAGE = 'mocked data';

// мапа с роутами и моковыми функциями
const MOCK_API_HANLDERS = {
  [API_ROUTES.GET_PAYMENTS]: getPayments,
};

// варианты вызова
// мокаем все:
// - mockRequsts(axios, instance);
// мокаем выборочные роуты:
// - mockRequsts(axios, instance, { routes: [API_ROUTES.GET_PAYMENTS] });
// - mockRequsts(axios, instance, { routes: Object.values(API_ROUTES) });
export default (axios, instance, config = null) => {
  const source = axios.CancelToken.source();

  instance.interceptors.request.use((axiosConfig) => {
    // Если запрос не нужно мокать
    if (config?.routes && Array.isArray(config.routes) && !config.routes.find((route) => route === axiosConfig.url)) {
      return axiosConfig;
    }

    // отменяем запрос. В новой версии axios можно сделать иначе
    axiosConfig.cancelToken = source.token;
    // в причине отмены записываем данные о роуте
    source.cancel(`${DEFUALT_CANCEL_MESSAGE}:${axiosConfig.url}`);

    return axiosConfig;
  }, (err) => {
    console.log('INTERCEPTOR REQUEST err: ', err);
  });

  instance.interceptors.response.use(null, async (error) => {
    // Если ошибка не из-за отмены запроса
    if (!error.message.includes(DEFUALT_CANCEL_MESSAGE)) {
      return error;
    }

    const route = error.message.split(':')[1];
    const response = await MOCK_API_HANLDERS[route]();

    return response;
  });
};
