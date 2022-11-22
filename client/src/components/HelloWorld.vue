<template>
  <div>
    <h3>Stuff is probably going on.</h3>
    <p>{{ msg }}</p>
    <div class="container">
      <button type="button" class="btn btn-primary">So what?</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: null
    }
  },
  methods: {
    async getMessage() {
      const path = 'http://localhost:5000/';
      try {
        const resp = await axios.get(path);
        this.msg = JSON.stringify(resp.data);
      } catch (err) {
        console.warn(err);
        this.msg = "Error, see console";
      }
    }
  },
  created() {
    this.getMessage();
  },
}
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
