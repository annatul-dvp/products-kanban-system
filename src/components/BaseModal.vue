
<template>
  <Teleport v-if="open" to="#teleport-target">
    <div class="teleport-blackout"></div>
    <div class="teleport-modal" @click="onOutsideClick" ref="modal">
      <!-- <h4 v-if="title">{{ title }}</h4> -->
      <div ref="contentElement" class="teleport-modal__content">
        <button type="button" class="teleport-modal__close" @click="doCloseModal">X</button>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script>
import {
  defineComponent,
  ref,
  watch
} from 'vue'

import useModal from '@/hooks/useModal'

export default defineComponent({
  props: {
    open: { type: Boolean }
    // title: { type: String }
  },
  setup (props, { emit: $emit }) {
    const contentElement = ref(null)

    const { doOpen, doClose } = useModal()

    const doCloseModal = () => {
      $emit('update:open', false)
    }

    const onOutsideClick = ($event) => {
      if ($event.target !== contentElement.value && $event.target.contains(contentElement.value)) {
        doCloseModal()
      }
    }

    watch(() => props.open, (isOpen) => {
      if (isOpen) {
        doOpen()
      } else {
        doClose()
      }
    }, { immediate: true })

    return {
      onOutsideClick,
      doCloseModal,

      contentElement
    }
  }
})
</script>

<style scoped lang="scss">
.teleport-blackout {
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.75;
  background-color: #000000;
}
.teleport-modal {
  z-index: 1000;
  overflow: auto;
  overflow-y: scroll;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;

  &__content {
    position: relative;
    width: 50%;
    max-width: 1000px;
    margin-top: auto;
    margin-bottom: auto;
    padding: 40px;
    background-color: #ffffff;
  }

  &__close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 15px;
    line-height: 1;
    background-color: transparent;
    border: none;
    font-size: 20px;
  }
}
</style>
