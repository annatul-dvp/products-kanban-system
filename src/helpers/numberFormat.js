export default function numberFormat (value) {
  return new Intl.NumberFormat('ru', { style: 'currency', currency: 'EUR' }).format(value)
}
