<template>
  <div class="home">
    {{ this.$store.state.productsInfo[0] }}
  </div>
  <div class="products-board">
    <div v-for="column in columnsList" :key="column.id"
      @drop="onDrop($event, column.id)" class="droppable products-board__column"
      @dragover.prevent @dragenter.prevent>
      <h3>{{ column.name }}</h3>
      <ProductCard v-for="(product) in $store.state.productsInfo.filter(p => p.columnId === column.id)"
        :key="product.id" :productData="product" v-model:editedProduct= "editedProduct"
        @dragstart="onDragStart($event, product.id)"
        :class="column.cardsClass" draggable="true"/>
    </div>
    <BaseModal v-model:open="editedProduct.isOpened">
      <ProductEditedCard :productId="editedProduct.editedProductId" :currentColumnId="getCurrentColumn(editedProduct.editedProductId)" />
    </BaseModal>
  </div>
</template>

<script>
import ProductCard from '@/components/ProductCard.vue'
import BaseModal from '@/components/BaseModal.vue'
import ProductEditedCard from '@/components/ProductEditCard.vue'
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'HomeView',
  components: {
    ProductCard,
    BaseModal,
    ProductEditedCard
  },
  setup () {
    const $store = useStore()
    $store.dispatch('loadProductsInfo')

    const editedProduct = ref({ isOpened: false, editedProductId: 0 })

    const getCurrentColumn = (productId) => {
      for (const p of $store.state.productsInfo) {
        if (p.id === productId) {
          return String(p.columnId)
        }
      }
      return '0'
    }

    const columnsList = {
      firstColumn: {
        id: 1,
        name: 'Товары в наличии',
        cardsClass: 'yellow'
      },
      secondColumn: {
        id: 2,
        name: 'Хочу купить',
        cardsClass: 'red'
      },
      thirdColumn: {
        id: 3,
        name: 'Уже куплено',
        cardsClass: 'blue'
      }
    }

    function onDragStart (e, itemId) {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('itemId', itemId.toString())
    }

    function onDrop (e, categoryId) {
      const itemId = parseInt(e.dataTransfer.getData('itemId'))
      console.log(itemId)
      console.log(categoryId)
      $store.dispatch('updateProductColumn', { productId: itemId, newColumnId: categoryId })
    }

    return {
      columnsList,
      editedProduct,
      onDragStart,
      onDrop,
      getCurrentColumn
    }
  }
}
</script>

<style lang="scss">
  * {
    box-sizing: border-box;
  }
  .products-board {
    display: flex;
    width: 100%;
    height: auto;

    &__column {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-grow: 1;
      width: 33%;
    }

    &__column:not(:last-child) {
      border-right: 1px solid black;
    }
  }
</style>
