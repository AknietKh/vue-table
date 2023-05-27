<template>
  <div class="data-table">
    <div class="data-table__filter">
      <ui-money v-model="moneyFilter" placeholder="search" />
    </div>

    <!-- Your component code here -->
    <ui-table
      class="data-table__table"
      :rows="rows"
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

export default {

  name: 'DataTable',

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
  }),

  computed: {
    pageCount() {
      return Math.ceil(this.rows.length / this.pageSize);
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
