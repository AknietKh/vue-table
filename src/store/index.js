import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api';
import storage from '../utils/storage';
import { STORAGE_KEYS } from '../configs/storageKeys';

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
        const cashedData = storage.getInfo(STORAGE_KEYS.PAYMENTS);

        if (cashedData && Array.isArray(cashedData)) {
          commit('setState', { data: cashedData });
          commit('setState', { isCached: true });
          return;
        }

        const { data } = await api.getPayments(params);

        if (Array.isArray(data)) {
          const isCashed = storage.setInfo(STORAGE_KEYS.PAYMENTS, data);
          if (isCashed) {
            commit('setState', { isCached: true });
          }

          commit('setState', { data });
        }
      } catch (e) {
        // eslint-disable-next-line no-alert
        alert(e?.message);
      } finally {
        commit('setState', { isLoading: false });
      }
    },
    removeCash({ commit }) {
      try {
        storage.removeInfo(STORAGE_KEYS.PAYMENTS);
        commit('setState', { isCashed: false });
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert(err?.message);
      }
    },
  },
});
