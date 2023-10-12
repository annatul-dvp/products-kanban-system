<template>
  <router-view/>
  <div id="teleport-target"></div>
</template>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
 align-items: center;
  font-family: Georgia, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
