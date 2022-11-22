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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
nav > a {
  margin: 1rem;
}
</style>
