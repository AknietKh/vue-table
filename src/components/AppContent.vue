<template>
  <main class="container mt-md-5">

    <!-- Loading spinner -->
    <ui-spinner v-if="isLoading" />

    <template v-else>
      <ui-alert v-if="isCached" type="success" header="Data was cached!">
        <template #default>
          <p>You can clear cache and load data again.</p>
        </template>
        <template #footer>
          <ui-button type="primary" @click="clearCache">
            Clear cache
          </ui-button>
        </template>
      </ui-alert>

      <data-table
        :rows="data"
        :columns="columns"
      />
    </template>
  </main>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { STORAGE_KEYS } from '../configs/storageKeys';

export default {

  name: 'AppContent',

  data: () => ({
    columns: [
      {
        label: 'ID',
        prop: 'id',
        width: '15%',
      },
      {
        label: 'Date',
        prop: 'date',
        width: '20%',
      },
      {
        label: 'Name',
        prop: 'name',
        width: '30%',
      },
      {
        label: 'Money',
        prop: 'money',
        width: '35%',
      },
    ],
    cachedLoad: null,
  }),

  computed: {
    ...mapState([
      'isLoading',
      'isCached',
      'data',
    ]),
  },

  async created() {
    // получаем расширенную версию load, которая умеет отдавать данные из кеша
    this.cachedLoad = await this.addCacheApiDecorator({ key: STORAGE_KEYS.PAYMENTS, fn: this.load });
    this.cachedLoad();
  },

  methods: {
    ...mapActions([
      'load',
      'addCacheApiDecorator',
      'removeCache',
    ]),
    async clearCache() {
      this.removeCache(STORAGE_KEYS.PAYMENTS);
      // Либо load, либо cacheLoad
      this.load();
    },
  },
};
</script>
