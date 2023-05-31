import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api';
import storage from '../utils/storage';

Vue.use(Vuex);

export default new Vuex.Store({

  state: () => ({
    data: [],
    isLoading: false,
    isCached: false,
  }),

  mutations: {
    setState(state, value) {
      Object.entries(value).forEach(([key, data]) => {
        if (!Array.isArray(state[key]) && state[key] && typeof state[key] === 'object') {
          state[key] = {
            ...state[key],
            ...data,
          };
        } else {
          state[key] = data;
        }
      });
    },
  },

  actions: {
    async load({ commit }, params = {}) {
      commit('setState', { isLoading: true });

      try {
        const { data } = await api.getPayments(params);

        if (Array.isArray(data)) {
          commit('setState', { data });
        }

        return data;
      } catch (e) {
        // eslint-disable-next-line no-alert
        alert(e?.message);
      } finally {
        commit('setState', { isLoading: false });
      }

      return null;
    },
    // Декоратор, который может оборачивать экшены
    addCacheApiDecorator({ commit }, { key, fn }) {
      return async (payload) => {
        try {
          const cachedData = storage.getInfo(key);

          if (cachedData && Array.isArray(cachedData)) {
            commit('setState', { data: cachedData });
            commit('setState', { isCached: true });
            return;
          }
          const data = await fn(payload);

          if (data && Array.isArray(data)) {
            const isCached = storage.setInfo(key, data);

            commit('setState', { isCached });
            commit('setState', { data });
          } else {
            commit('setState', { isCached: false });
          }
        } catch (e) {
          commit('setState', { isCached: false });
          // eslint-disable-next-line no-alert
          alert(e?.message);
        }
      };
    },
    removeCache({ commit }, key) {
      try {
        storage.removeInfo(key);
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert(err?.message);
      } finally {
        commit('setState', { isCached: false });
      }
    },
  },
});
