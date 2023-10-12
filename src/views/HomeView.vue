<template>
  <h2 class="page-title">Product Kanban Stystem</h2>
  <button class="btn page-btn" @click="createNewProduct">Создать новый продукт</button>
  <div class="products-board">
    <div v-for="column in columnsList" :key="column.id"
      @drop="onDrop($event, column.id)" class="droppable products-board__column" :class="column.columnClass"
      @dragover.prevent @dragenter.prevent>
      <h3 class="column-title">{{ column.name }}</h3>
      <ProductCard v-for="(product) in $store.state.productsInfo.filter(p => p.columnId === column.id)"
        :key="product.id" :productData="product" v-model:editedProduct= "editedProduct" v-model:isProductNew="isProductNew"
        @dragstart="onDragStart($event, product.id)"
        :class="column.cardsClass" draggable="true"/>
    </div>
    <BaseModal v-model:open="editedProduct.isOpened">
      <ProductEditedCard v-if="!isProductNew" :isProductNew="isProductNew" :productId="editedProduct.editedProductId" :currentColumnId="getCurrentColumn(editedProduct.editedProductId)" />
      <ProductEditedCard v-if="isProductNew" :isProductNew="isProductNew" currentColumnId="'1'" />
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

    const isProductNew = ref(false)

    const editedProduct = ref({ isOpened: false, editedProductId: 0 })

    const createNewProduct = () => {
      isProductNew.value = true
      editedProduct.value = {
        isOpened: true,
        editedProductId: 0
      }
    }

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
        columnClass: 'products-board__first-column',
        cardsClass: 'card-is-unsorted'
      },
      secondColumn: {
        id: 2,
        name: 'Хочу купить',
        columnClass: 'products-board__second-column',
        cardsClass: 'card-is-wished'
      },
      thirdColumn: {
        id: 3,
        name: 'Уже куплено',
        columnClass: 'products-board__third-column',
        cardsClass: 'card-is-achived'
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
      isProductNew,
      columnsList,
      editedProduct,
      onDragStart,
      onDrop,
      getCurrentColumn,
      createNewProduct
    }
  }
}
</script>

<style lang="scss">
  * {
    box-sizing: border-box;
  }

  html {
    font-size: 18px;

    @media (max-width: 768px) {
      font-size: 12px;
    }

    @media (max-width: 380px) {
      font-size: 8px;
    }
  }

  .btn {
    border: none;
    font-family: Georgia, serif;
    background-color: transparent;
    transition: all .3s ease-in-out;
    &:hover {
      cursor: pointer;
      transform: scale(1.1);
    }

    &:active {
      transform: scale(.9);
    }
  }

  .btn-with-img {
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-btn {
    width: 30%;
    margin-bottom: 20px;
    padding: 20px 50px;
    border-radius: 15px;
    background-color: #02151a;
    color: #ffffff;

    @media (max-width: 768px) {
      width: 50%;
      border-radius: 10px;
    }

    @media (max-width: 380px) {
      width: 100%;
    }
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
      // flex-shrink: 1;
      // flex-basis: 20%;
      width: 30%;
      border-radius: 50px;

      @media (max-width: 768px) {
        border-radius: 10px;
      }
    }
    &__column:first-child {
      margin-left: 2%;
      margin-right: 1%;
    }

    &__column:last-child {
      margin-left: 1%;
      margin-right: 2%;
    }

    &__column:not(:first-child),
    &__column:not(:last-child){
      margin-left: 1%;
      margin-right: 1%;
    }

    &__first-column {
      background-color: rgba(99, 189, 153, 1);
    }

    &__second-column {
      background-color: rgba(234, 122, 88, 1);
    }

    &__third-column {
      background-color: rgba(8, 120, 145, 1);
    }

    .column-title {
      font-size: 1.5rem;
    }

  }
</style>
