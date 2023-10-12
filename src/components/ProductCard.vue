<template>
  <!-- <div class="p-card" v-if="productStatus.isLoading">Идёт загрузка товара...</div>
  <div class="p-card" v-else-if="productStatus.isFailed">Не удалось загрузить данные о товаре</div>
  <div class="p-card" v-else> -->
  <div class="p-card">
    <button class="btn btn-with-img p-card-btn p-card__edit-btn" @click="startEditingProduct"></button>
    <button class="btn btn-with-img p-card-btn p-card__delete-btn" @click="toDeleteProduct"></button>
    <img class="p-card__img" :src="productData.image" alt="Заголовок" draggable="false">
    <h4 class="p-card__title">{{ productData.title }}</h4>
    <div class="p-card__category">{{ productData.category }}</div>
    <div class="p-card__rating">
      <span class="p-card__score">Rating: {{ productData.rating.rate }}</span>
      <span class="p-card__votes-amount">Votes: {{ productData.rating.count }}</span>
    </div>
    <p class="p-card__desc">{{ productData.description }}</p>
    <div class="p-card__price">{{ productData.pricePretty }}</div>

    <!--Модальное окно при удалении продукта-->
    <BaseModal v-model:open="isButtonCloseClicked">
      <p v-if="!isDeleted">Вы уверены, что хотите удалить продукт?</p>
      <button v-if="!isDeleted" @click="deleteProduct">Да</button>
      <p v-if="deletingIsFailed">Ошибка! Не удалось удалить продукт.</p>
      <p v-if="isDeleting">Идёт удаление продукта...</p>
      <p v-if="isDeleted">Продукт удалён!</p>
    </BaseModal>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { useStore } from 'vuex'
import BaseModal from './BaseModal.vue'
import { API_BASE_URL } from '../config'
// import useProduct from '@/hooks/useProduct'

export default defineComponent({
  props: {
    productData: { type: Object, required: true }
  },
  components: {
    BaseModal
  },
  setup (props, { emit: $emit }) {
    const $store = useStore()

    const startEditingProduct = () => {
      console.log(true)
      console.log(props.productData.id)
      $emit('update:isProductNew', false)
      $emit('update:editedProduct', { isOpened: true, editedProductId: props.productData.id })
    }

    const isButtonCloseClicked = ref(false)
    const isDeleting = ref(false)
    const isDeleted = ref(false)
    const deletingIsFailed = ref(false)

    /* Удалить продукт? */
    const toDeleteProduct = () => {
      isButtonCloseClicked.value = true
    }

    /* Удаление продукта */
    const deleteProduct = () => {
      isDeleting.value = true
      isDeleted.value = false

      fetch(`${API_BASE_URL}/products/${props.productData.id}`, {
        method: 'DELETE'
      })
        .catch(() => { deletingIsFailed.value = true })
        .then(res => res.json())
        .then(resolve => {
          console.log(resolve)
          isDeleting.value = false
          isDeleted.value = true
          $store.dispatch('deleteProduct', resolve.id)
        })
    }

    return {
      isDeleting,
      isDeleted,
      deletingIsFailed,
      isButtonCloseClicked,
      startEditingProduct,
      toDeleteProduct,
      deleteProduct
    }
  }
})
</script>

<style scoped lang="scss">

  .p-card {
    position: relative;
    box-sizing: border-box;
    width: 90%;
    height: auto;
    max-width: 100%;
    margin-bottom: 20px;
    padding: 45px 15px 15px 15px;
    box-shadow: 0px 5px 15px 2px rgba(34, 60, 80, 0.5);
    // border: 1px solid red;
    // border-radius: 00px;

    @media (max-width: 380px) {
      padding: 35px 5px 5px 5px;
    }

    &__edit-btn {
      right: 45px;
      background-image: url(../assets/edit.svg);
      @media (max-width: 380px) {
        right: 30px;
      }
    }

    &__delete-btn {
      right: 10px;
      background-image: url(../assets/close.svg);
      @media (max-width: 380px) {
        right: 5px;
      }
    }

    &__img {
      width: 100%;
    }

    &__title {
      font-size: 1.2rem;
    }

    &__category,
    &__score,
    &__votes-amount {
      color: rgba(2, 21, 26, 0.8);
      font-style: italic;
    }

    &__category {
      margin-bottom: 2px;
    }

    &__score {
      margin-right: 5px;
    }

    &__desc {
      @media (max-width: 380px) {
        word-break: break-all;
      }
    }

    &:hover {
      cursor: grab;
    }
  }

  .p-card-btn {
    position: absolute;
    width: 25px;
    height: 25px;
    top: 10px;

    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }

    @media (max-width: 380px) {
      width: 15px;
      height: 15px;
    }
  }

  .card-is-unsorted {
    background-color: #fff8d8;
  }

  .card-is-wished {
    background-color: #a6c4bc;
  }

  .card-is-achived {
    background-color: #892143;
  }

  .products-board__third-column {
    .p-card  {
      color: #ffffff;

      &__category,
      &__score,
      &__votes-amount {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
</style>
