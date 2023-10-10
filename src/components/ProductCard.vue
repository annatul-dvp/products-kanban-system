<template>
  <!-- <div class="p-card" v-if="productStatus.isLoading">Идёт загрузка товара...</div>
  <div class="p-card" v-else-if="productStatus.isFailed">Не удалось загрузить данные о товаре</div>
  <div class="p-card" v-else> -->
  <div class="p-card">
    <button class="btn p-card-btn p-card__edit-btn" @click="startEditingProduct"></button>
    <button class="btn p-card-btn p-card__delete-btn" @click="toDeleteProduct"></button>
    <img class="p-card__img" :src="productData.image" alt="Заголовок" draggable="false">
    <h4 class="p-card__title">{{ productData.title }}</h4>
    <div class="p-card__category">{{ productData.category }}</div>
    <div class="p-card__rating">
      <span class="p-card__score">{{ productData.rating.rate }}</span>
      <span class="p-card__votes-amount">Количество голосов: {{ productData.rating.count }}</span>
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

  .btn {
    border: none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    transition: all .2s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(.9);
    }
  }
  .p-card {
    position: relative;
    box-sizing: border-box;
    width: 90%;
    max-width: 100%;
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid red;
    border-radius: 20px;

    &__edit-btn {
      right: 45px;
      background-image: url(../assets/edit.svg);
    }

    &__delete-btn {
      right: 10px;
      background-image: url(../assets/close.svg);
    }

    &__img {
      width: 100%;
    }
  }

  .p-card-btn {
    position: absolute;
    width: 25px;
    height: 25px;
    top: 10px;
  }

  .yellow {
    background-color: yellow;
  }

  .red {
    background-color: red;
  }

  .blue {
    background-color: blue;
  }
</style>
