<template>
  <nav id="nav">
    <router-link to="/">Höme</router-link>
    <router-link to="/connect">Kornekt</router-link>
  </nav>
  <router-view/>
</template>

<script>
  export default {
    name: 'App',
    components: {

    }
  }
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
