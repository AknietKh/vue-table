// добавляет разделитель тысячей
export function localizeNumber(amount, decimal = 2, separator = ' ') {
  if (amount !== 0 && !amount) return '';

  const amountStr = typeof amount === 'number' ? amount.toString() : amount;
  const [integer, decimalNum] = amountStr.split(decimal);
  const formattedInteger = integer.replace(/(\d)(?=(?:\d{3})+\b)/gm, `$1${separator}`);

  return decimalNum ? `${formattedInteger}.${decimalNum}` : formattedInteger;
  // return new Intl.NumberFormat(locale).format(+amountStr); - можно еще попробовать так локализовать или через i18n
}

// удаляем пробелы
export function unlocalizeNumber(amountStr) {
  return amountStr.replace(/[^0-9.]/g, '');
}
