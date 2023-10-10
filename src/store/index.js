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
    /* Получение данных о продуктах */
    undateProductsInfo (state, productsInfo) {
      state.productsInfo = productsInfo.map(product => ({
        ...product,
        pricePretty: numberFormat(product.price),
        columnId: 1
      }))
    },
    /* Обновление данных в какой колонке находится продукт */
    updateColumnOfProduct (state, { productId, newColumnId }) {
      const item = state.productsInfo.find(p => p.id === productId)
      if (item) {
        item.columnId = newColumnId
      }
    },
    /* Внесение изменений в продукт */
    updateProductInfo (state, updatedProductInfo) {
      state.productsInfo = state.productsInfo.map(product => {
        if (product.id === updatedProductInfo.id) {
          return {
            ...product,
            title: updatedProductInfo.title,
            price: updatedProductInfo.price,
            pricePretty: numberFormat(updatedProductInfo.price),
            description: updatedProductInfo.description,
            category: updatedProductInfo.category
            // rating: {
            //   rate: updatedProductInfo.rating.rate,
            //   count: updatedProductInfo.rating.count
            // }
          }
        } else {
          return product
        }
      })
    },
    /* Удаление продукта */
    deletingProduct (state, productId) {
      const index = state.productsInfo.findIndex(p => p.id === productId)
      if (index > -1) {
        state.productsInfo.splice(index, 1)
      }
    }
  },
  actions: {
    /* Получение данных о продуктах */
    loadProductsInfo (context) {
      return fetch(`${API_BASE_URL}/products`)
        .then(res => res.json())
        .then(response => { context.commit('undateProductsInfo', response) })
    },
    /* Обновление данных в какой колонке находится продукт */
    updateProductColumn (context, { productId, newColumnId }) {
      return context.commit('updateColumnOfProduct', { productId, newColumnId })
    },
    /* Внесение изменений в продукт */
    updateProductData (context, updatedProduct) {
      console.log(updatedProduct)
      return context.commit('updateProductInfo', updatedProduct)
    },
    /* Удаление продукта */
    deleteProduct (context, productToDeleteId) {
      console.log(productToDeleteId)
      return context.commit('deletingProduct', productToDeleteId)
    }
  },
  modules: {
  }
})
