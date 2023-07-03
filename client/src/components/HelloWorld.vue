<template>
  <div>
    <h3>Stuff is probably going on.</h3>
    <p>{{ msg }}</p>
    <div class="container">
      <button @click="getMessage" class="btn btn-primary">
        So what?
      </button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
// import {ref, onCreated} from 'vue';

let msg = "k. nice.";

const getMessage = async () => {
  const path = '/status';
  try {
    const resp = await axios.get(path);
    console.log(resp);
    msg = JSON.stringify(resp.data);
  } catch (err) {
    console.warn(err);
    msg = "Error, see console";
  }
};

getMessage();

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
p {
  color: #42b983;
}
</style>
