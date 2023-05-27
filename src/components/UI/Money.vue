<template>
  <input
    type="text"
    :value="valueInput"
    @input="handleInput"
    class="ui-money"
  />
</template>

<script>
import { localizeNumber, unlocalizeNumber } from '@/utils/helpers';

export default {

  name: 'UiMoney',

  props: {
    value: {
      type: Number,
      require: true,
    },
    precision: {
      type: Number,
      default: 2,
      validator: (precision) => {
        const [min, max] = [0, 20];
        return precision >= min && precision <= max;
      },
    },
    decimal: {
      type: String,
      default: '.',
    },
  },

  data() {
    return {
      valueInput: '',
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(value) {
        if (value !== +unlocalizeNumber(this.valueInput)) {
          const formattedValue = !value && value !== 0 ? '' : value.toString();
          this.updateValueInput(formattedValue);
        }
      },
    },
  },

  methods: {
    handleInput(event) {
      const { value } = event.target;
      this.valueInput = value;

      this.updateValueInput(value);
      const inputNumber = unlocalizeNumber(this.valueInput);

      // эмитим undefined, что бы очищать поле в родителе
      this.$emit('input', inputNumber !== '' ? +inputNumber : undefined);
    },
    updateValueInput(value) {
      const amount = this.formatValueToNumber(value);
      this.valueInput = this.addThousandSeparator(amount);
    },
    addThousandSeparator(amountStr) {
      if (!amountStr) return '';

      const [integer, decimal] = amountStr.split(this.decimal);
      const isHaveDecimalPoint = amountStr.includes(this.decimal);

      if (isHaveDecimalPoint && !decimal) {
        return `${localizeNumber(integer, this.decimal)}${this.decimal}`;
      }

      return localizeNumber(amountStr, this.decimal);
    },
    formatValueToNumber(amountStr) {
      if (amountStr === '') {
        return null;
      }

      if (amountStr.startsWith(',') || amountStr.startsWith('.')) {
        amountStr = amountStr.substring(1);
      }

      let amount = amountStr.replace(/[,]/g, this.decimal).replace(/[^0-9.]/g, '');

      const dotLength = amount.match(/\./g);
      if (dotLength && dotLength.length > 1) {
        amount = amount.substring(0, amount.lastIndexOf(this.decimal));
      } else if (dotLength && dotLength.length === 1) {
        const separator = amount.split(this.decimal);
        amount = `${separator[0]}.${separator[1].substring(0, this.precision)}`;
      }

      return amount;
    },
  },
};
</script>
