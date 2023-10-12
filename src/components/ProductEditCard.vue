<template>
  <!-- <div class="p-card-info" v-if="productStatus.isLoading">Идёт загрузка товара...</div>
  <div class="p-card-info" v-else-if="productStatus.isFailed">Не удалось загрузить данные о товаре</div>
  <div class="p-card-info" v-else> -->
  <div class="p-card-info">
    <h4>Информация о товаре</h4>
    <form class="product-form" action="#" method="POST" @submit.prevent="saveChanges">
      <label class="product-form__lable">
        <span class="product-form__input-title">Наименование товара:</span>
        <input class="product-form__input" type="text" v-model="currentTitle">
      </label>
      <label class="product-form__lable">
        <span class="product-form__input-title">Категория товара:</span>
        <input class="product-form__input" type="text" v-model="currentCategory">
      </label>
      <label class="product-form__lable">
        <span class="product-form__input-title">Адрес изображения товара:</span>
        <input class="product-form__input" type="url" placeholder="https://example.com" pattern="https://.*" v-model="currentImageURL">
      </label>
      <label class="product-form__lable">
        <span class="product-form__input-title">Рейтинг товара:</span>
        <input class="product-form__input" type="text" v-model="currentRating">
      </label>
      <label class="product-form__lable">
        <span class="product-form__input-title">Количество проголосовавших:</span>
        <input class="product-form__input" type="text" v-model="currentVotesAmount">
      </label>
      <label class="product-form__lable">
        <span class="product-form__input-title">Описание товара:</span>
        <textarea class="product-form__textarea" rows="10" v-model="currentDescription"></textarea>
      </label>
      <label class="product-form__lable">
        <span class="product-form__input-title">Цена товара:</span>
        <input class="product-form__input" type="text" v-model="currentPrice">
      </label>
      <button v-if="!isProductNew" class="modal-btn product-form__btn" type="submit">Сохранить изменения</button>
      <button v-if="isProductNew" class="modal-btn product-form__btn" type="submit">Создать</button>
    </form>
    <p v-if="savingChangesIsFailed">Ошибка! Не удалось сохранить изменения.</p>
    <p v-if="savingChangesIsDone">Изменения сохранены</p>
    <p v-if="savingChangesIsLoading">Сохраняем...</p>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
// import useProduct from '@/hooks/useProduct'
import { useStore } from 'vuex'
import { API_BASE_URL } from '../config'
// import BaseFormText from './BaseModal.vue'

export default defineComponent({
  props: {
    // product: { type: Object, required: true },
    isProductNew: { typy: Boolean, required: true },
    productId: { type: [Number, String] },
    currentColumnId: { type: String, required: true }
  },
  // components: {
  //   BaseFormText
  // },

  setup (props) {
    const $store = useStore()

    const currentProduct = $store.state.productsInfo.find(p => (p.id === props.productId))
    const currentTitle = ref()
    const currentCategory = ref()
    const currentImageURL = ref()
    const currentRating = ref()
    const currentVotesAmount = ref()
    const currentDescription = ref()
    const currentPrice = ref()

    if (currentProduct) {
      currentTitle.value = currentProduct.title
      currentCategory.value = currentProduct.category
      currentImageURL.value = currentProduct.image
      currentRating.value = currentProduct.rating.rate
      currentVotesAmount.value = currentProduct.rating.count
      currentDescription.value = currentProduct.description
      currentPrice.value = currentProduct.price
    }
    const savingChangesIsLoading = ref(false)
    const savingChangesIsDone = ref(false)
    const savingChangesIsFailed = ref(false)

    function saveChanges () {
      savingChangesIsLoading.value = true
      savingChangesIsDone.value = false

      if (!props.isProductNew) {
        /* Внесение изменений в существующий продукт */
        fetch(`${API_BASE_URL}/products/${props.productId}`, {
          method: 'PATCH',
          body: JSON.stringify(
            {
              title: currentTitle.value,
              price: currentPrice.value,
              description: currentDescription.value,
              image: currentImageURL.value,
              category: currentCategory.value
              // rating: { //в рейтинг по каки-то причинам не вносятся изменения, псевдосервер его не возвращает
              //   rate: currentRating.value,
              //   count: currentVotesAmount.value
              // }
            }
          ),
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          }
        })
          .catch(() => { savingChangesIsFailed.value = true })
          .then(res => res.json())
          .then(resolve => {
            savingChangesIsLoading.value = false
            savingChangesIsDone.value = true
            $store.dispatch('updateProductData', {
              ...resolve,
              rating: {
                rate: currentRating.value,
                count: currentVotesAmount.value
              }
            })
          })
      } else {
        /* добавление нового продукта */
        fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          body: JSON.stringify(
            {
              title: currentTitle.value,
              price: currentPrice.value,
              description: currentDescription.value,
              image: currentImageURL.value,
              category: currentCategory.value
              // rating: { //в рейтинг по каки-то причинам не вносятся изменения, псевдосервер его не возвращает
              //   rate: currentRating.value,
              //   count: currentVotesAmount.value
              // }
            }
          ),
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          }
        })
          .catch(() => { savingChangesIsFailed.value = true })
          .then(res => res.json())
          .then(resolve => {
            savingChangesIsLoading.value = false
            savingChangesIsDone.value = true
            $store.dispatch('addNewProduct', {
              ...resolve,
              rating: {
                rate: currentRating.value,
                count: currentVotesAmount.value
              }
            })
          })
      }
    }

    return {
      currentTitle,
      currentCategory,
      currentImageURL,
      currentRating,
      currentVotesAmount,
      currentDescription,
      currentPrice,

      savingChangesIsLoading,
      savingChangesIsDone,
      savingChangesIsFailed,

      saveChanges
    }
  }
})
</script>

<style scoped lang="scss">
  .product-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &__lable {
      display: flex;
      width: 100%;
      padding: 5px;
      // margin-bottom: 5px;

      &:not(:last-child) {
        margin-bottom: 5px;
      }
    }
    &__input-title {
      padding: 5px;
      margin-right: 10px;
    }
    &__input {
      flex-grow: 1;
      border: 1px solid #000000;
      padding: 5px;
      margin-left: 2px;
    }
    &__textarea {
      flex-grow: 1;
      border: 1px solid #000000;
      padding: 5px;
      margin-left: 2px;
    }

    &__btn {
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }

  .modal-btn {
    min-width: 180px;
    width: 40%;
    padding: 20px 30px;
    border-radius: 10px;
    border: none;
    background-color: #02151a;
    color: #ffffff;
    font-family: Georgia, serif;
    font-size: 1rem;

    &:hover {
      background-color: #b31d14;
    }

    &:active {
      background-color: #3d0502;
    }
  }
</style>
