import { createStore } from 'vuex'
import numberFormat from '@/helpers/numberFormat'
import { API_BASE_URL } from '../config'

export default createStore({
  state: {
    productsInfo: []
  },
  getters: {

  },
  mutations: {
    undateProductsInfo (state, productsInfo) {
      // state.productsInfo = productsInfo
      state.productsInfo = productsInfo.map(product => ({
        ...product,
        pricePretty: numberFormat(product.price),
        columnId: 1
      }))
      // console.log(state.productsInfo)
    },
    updateColumnOfProduct (state, { productId, newColumnId }) {
      const item = state.productsInfo.find(p => p.id === productId)

      if (item) {
        item.columnId = newColumnId
      }
      console.log(item)
      console.log(productId)
      console.log(newColumnId)
      console.log(state.productsInfo)
    }
  },
  actions: {
    loadProductsInfo (context) {
      return fetch(`${API_BASE_URL}/products`)
        .then(res => res.json())
        .then(response => { context.commit('undateProductsInfo', response) })
    },
    updateProductColumn (context, { productId, newColumnId }) {
      console.log(productId)
      console.log(newColumnId)
      return context.commit('updateColumnOfProduct', { productId, newColumnId })
    }
  },
  modules: {
  }
})
