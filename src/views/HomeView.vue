<template>
  <div class="home">
    {{ this.$store.state.productsInfo[0] }}
  </div>
  <div class="products-board">
    <div v-for="column in columnsList" :key="column.id"
      @drop="onDrop($event, column.id)" class="droppable products-board__column"
      @dragover.prevent @dragenter.prevent>
      <ProductCard v-for="(product) in this.$store.state.productsInfo.filter(p => p.columnId === column.id)"
        :key="product.id" :productId="product.id" :columnId="product.columnId"
        @dragstart="onDragStart($event, product.id)"
        :class="column.cardsClass" draggable="true"/>
    </div>
    <!-- <div class="products-board__column" >
      <ProductCard v-for="(product) in this.$store.state.productsInfo" :key="product.id" :productId="product.id" :columnId="product.columnId"
      :currentColumn="columnsList.firstColumn.name" :class="cardColumnInfo.cardClass"
      />
    </div>
    <div class="products-board__column">

    </div>
    <div class="products-board__column">

    </div> -->
  </div>
</template>

<script>
import ProductCard from '@/components/ProductCard.vue'
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'HomeView',
  components: {
    ProductCard
  },
  setup () {
    const $store = useStore()
    $store.dispatch('loadProductsInfo')

    const cardColumnInfo = ref({
      cardId: 0,
      cardClass: 'yellow'
    })

    const columnsList = {
      firstColumn: {
        id: 1,
        name: 'firstColumn',
        cardsClass: 'yellow'
      },
      secondColumn: {
        id: 2,
        name: 'secondColumn',
        cardsClass: 'red'
      },
      thirdColumn: {
        id: 3,
        name: 'thirdColumn',
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
      cardColumnInfo,
      columnsList,
      onDragStart,
      onDrop
    }
  }
}
</script>

<style lang="scss">
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
