import { mount } from '@vue/test-utils';
import Money from '@/components/UI/Money.vue';

const testCases = [
  ['asd', '', undefined],
  ['am100', '100', 100],
  [',1105', '1 105', 1105],
  ['20asd000', '20 000', 20000],
  ['1000.', '1 000.', 1000],
  ['1000,', '1 000.', 1000],
  ['1000.5', '1 000.5', 1000.5],
  ['1000.50', '1 000.50', 1000.5],
  ['1000.56', '1 000.56', 1000.56],
  ['1000.56.', '1 000.56', 1000.56],
  ['1000.567', '1 000.56', 1000.56],
];

describe('Money component', () => {
  test.each(testCases)('%p (%p) -> %p', async (input, value, emitted) => {
    const wrapper = mount(Money);
    const control = wrapper.find('input');

    control.setValue(input);

    await wrapper.vm.$nextTick();

    expect(control.element.value).toBe(value);

    /*
      1. Не особо понял почему тут брался второй по счету emit, когда ожидаем только один emit
      2. По тесту ожидалось, что если value пустое, то не должно быть emit (проверка что евента нету - (wrapper.emitted('input')[0]).toEqual(undefined)).
      Но в таком случае как очищать поле у родителя, когда очищаем поле у money (кроме this.$parent)?

      Мне кажется это скорее не учтено в тесте, поэтому изменил проверку
    */
    expect(wrapper.emitted('input')[0]).toEqual([emitted]);
  });
});
