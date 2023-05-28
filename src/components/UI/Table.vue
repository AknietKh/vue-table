<template>
  <div
    class="ui-table"
    :style="{
      '--ui-table-columns': columnDistribution
    }"
  >
    <div
      class="ui-table__header"
    >
      <div
        v-for="column in columns"
        :key="column.prop"
        class="ui-table__cell-head"
      >
        {{ column.label }}
      </div>
    </div>
    <div class="ui-table__body">
      <div
        v-for="row in localRows"
        :key="row.id"
        class="ui-table__rows"
      >
        <div
          v-for="column in columns"
          :key="`${column.prop}_${row.id}`"
          class="ui-table__cell"
        >
          <p class="ui-table__mobile-label">
              {{ column.label }}
          </p>
          <!-- если нужно можно поулчить доступ до всей ячейки -->
          <slot :name="column.prop" :cell="row[column.prop]" :column="row">
            <p>{{ row[column.prop] }}</p>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'UiTable',

  props: {
    rows: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
  },

  data: () => ({
    localRows: [],
  }),

  computed: {
    columnDistribution() {
      return this.columns.map((item) => item.width).join(' ');
    },
  },

  watch: {
    currentPage: {
      immediate: true,
      handler(currentPage) {
        if (currentPage) {
          this.updateRows();
        }
      },
    },
    rows: {
      handler() {
        this.updateRows();
      },
    },
  },

  methods: {
    updateRows() {
      const offset = (this.currentPage - 1) * this.perPage;
      this.localRows = this.rows.slice(offset, this.perPage * this.currentPage);
    },
  },
};
</script>
