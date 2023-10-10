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
        <input class="product-form__input" type="text" v-model="currentRating" readonly>
      </label>
      <label class="product-form__lable">
        <span class="product-form__input-title">Количество проголосовавших:</span>
        <input class="product-form__input" type="text" v-model="currentVotesAmount" readonly>
      </label>
      <label class="product-form__lable">
        <span class="product-form__input-title">Описание товара:</span>
        <textarea class="product-form__textarea" rows="10" v-model="currentDescription"></textarea>
      </label>
      <label class="product-form__lable">
        <span class="product-form__input-title">Цена товара:</span>
        <input class="product-form__input" type="text" v-model="currentPrice">
      </label>
      <button class="btn product-form__btn" type="submit">Сохранить изменения</button>
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
    productId: { type: [Number, String], required: true },
    currentColumnId: { type: String, required: true }
  },
  // components: {
  //   BaseFormText
  // },

  setup (props) {
    const $store = useStore()

    const currentProduct = $store.state.productsInfo.find(p => (p.id === props.productId))
    const currentTitle = ref(currentProduct.title)
    const currentCategory = ref(currentProduct.category)
    const currentImageURL = ref(currentProduct.image)
    const currentRating = ref(currentProduct.rating.rate)
    const currentVotesAmount = ref(currentProduct.rating.count)
    const currentDescription = ref(currentProduct.description)
    const currentPrice = ref(currentProduct.price)

    const savingChangesIsLoading = ref(false)
    const savingChangesIsDone = ref(false)
    const savingChangesIsFailed = ref(false)

    function saveChanges () {
      savingChangesIsLoading.value = true
      savingChangesIsDone.value = false

      fetch(`${API_BASE_URL}/products/${props.productId}`, {
        method: 'PATCH',
        body: JSON.stringify(
          {
            title: currentTitle.value,
            price: currentPrice.value,
            description: currentDescription.value,
            image: currentImageURL.value,
            category: currentCategory.value
            // rating: {
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
          console.log(resolve)
          savingChangesIsLoading.value = false
          savingChangesIsDone.value = true
          $store.dispatch('updateProductData', resolve)
        })
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

  .btn {
    min-width: 180px;
    width: 40%;
    padding: 20px 30px;
    border-radius: 10px;
    border: none;
    background-color: #91b4c9;
    font-family: Georgia, serif;
    font-size: 1rem;
  }
</style>
