<template>
  <div class="data-table">
    <div class="data-table__filter">
      <ui-money v-model="moneyFilter" placeholder="search" />
    </div>

    <!-- Your component code here -->
    <ui-table
      class="data-table__table"
      :rows="localRows"
      :columns="columns"
      :perPage="pageSize"
      :current-page="page"
    >
      <template #money="data">
        <p>{{ $options.localizeNumber(data.cell) }}</p>
      </template>
      <template #date="data">
        <p>{{ $options.DateTime.fromISO(data.cell).toLocaleString() }}</p>
      </template>
    </ui-table>

    <div class="data-table__paginator">
      <ui-pagination
        v-model="page"
        :pages="pageCount"
      />
    </div>
  </div>
</template>

<script>
import { localizeNumber } from '@/utils/helpers';
import { DateTime } from 'luxon';
import debounce from 'lodash/debounce';

export default {

  name: 'DataTable',

  // добавляем в $options или же можно в data/computed
  localizeNumber,
  DateTime,

  props: {
    rows: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    page: 1,
    pageSize: 4,
    moneyFilter: undefined,
    localRows: [],
    debouncedFilter: null,
  }),

  computed: {
    pageCount() {
      return Math.ceil(this.localRows.length / this.pageSize);
    },
  },

  watch: {
    moneyFilter: {
      handler(moneyFilter) {
        this.debouncedFilter(moneyFilter);
      },
    },
    rows: {
      immediate: true,
      handler(rows) {
        this.localRows = rows.slice();
      },
    },
  },

  created() {
    this.debouncedFilter = debounce(this.handleFilter, 300);
  },

  methods: {
    handleFilter(moneyFilter) {
      if (moneyFilter) {
        this.localRows = this.rows.filter((row) => row.money <= moneyFilter);
      } else {
        this.localRows = this.rows.slice();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.data-table {
  &__table {
    margin: 16px 0;
  }
}
</style>
