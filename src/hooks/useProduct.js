/* Пришлось отказаться от этого хука, так как база данных фейковая и не обновляется */
/* Данный код не применяется на данный момент с данной базой. Удалять жалко */
import numberFormat from '@/helpers/numberFormat'
import { API_BASE_URL } from '../config'
import { computed, ref, reactive } from 'vue'

export default function () {
  const productData = ref(null)

  const rating = computed(() => productData.value.rating.rate)

  const fetchStatus = reactive({
    isLoading: false,
    isFailed: false
  })

  const fetchProduct = (productId, columnId) => {
    fetchStatus.isLoading = true
    fetchStatus.isFailed = false
    fetch(`${API_BASE_URL}/products/${productId}`)
      .then(res => res.json())
      .then(response => {
        const p = response
        productData.value = Object.assign(p, {
          pricePretty: numberFormat(p.price),
          columnId: columnId
        })
      })
      .catch(() => { fetchStatus.isFailed = true })
      .then(() => { fetchStatus.isLoading = false })
  }

  return {
    product: productData,
    rating,
    status: fetchStatus,

    fetchProduct
  }
}
