<template>
  <div class="p-card" v-if="productStatus.isLoading">Идёт загрузка товара...</div>
  <div class="p-card" v-else-if="productStatus.isFailed">Не удалось загрузить данные о товаре</div>
  <div class="p-card" v-else>
    <img class="p-card__img" :src="product.image" alt="Заголовок" draggable="false">
    <h3 class="p-card__title">{{ product.title }}</h3>
    <div class="p-card__category">{{ product.category }}</div>
    <div class="p-card__rating">
      <span class="p-card__score">{{ rating }}</span>
      <span class="p-card__votes-amount">Количество голосов: {{ product.rating.count }}</span>
    </div>
    <p class="p-card__desc">{{ product.description }}</p>
    <div class="p-card__price">{{ product.pricePretty }}</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import useProduct from '@/hooks/useProduct'

export default defineComponent({
  props: {
    // product: { type: Object, required: true },
    productId: { type: [Number, String], required: true },
    columnId: { type: [Number, String], required: true }
    // currentColumn: { type: String, required: true }
  },
  setup (props) {
    const {
      product,
      rating,
      status: productStatus,
      fetchProduct
    } = useProduct()

    fetchProduct(props.productId, props.columnId)

    return {
      product,
      rating,
      productStatus
    }
  }
})
</script>

<style scoped lang="scss">
  .p-card {
    box-sizing: border-box;
    width: 90%;
    max-width: 100%;
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid red;
    border-radius: 20px;

    &__img {
      width: 100%;
    }
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
