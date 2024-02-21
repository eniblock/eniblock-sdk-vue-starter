<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <button v-on:click="login" v-if="!isLoggedIn">Login to create a wallet</button>
    <p v-else>
      Your wallet and your account are instantiated<br>
      Your public key : {{ publicKey }}<br>
      Your address : {{ address }}<br>
      You can check your console to see the detail of these objects.<br>
      <button v-on:click="logout">Logout</button>
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript" target="_blank"
             rel="noopener">typescript</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a>
      </li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import {Eniblock, UnsafeStorage} from "@eniblock/sdk";
import authService from "@/services/authService";
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    msg: String
  },

  methods: {
    login() {
      return authService.login();
    },
    logout() {
      authService.logout(localStorage.getItem('starter_sdk_vue_access_token') ?? '');
      this.isLoggedIn = false;
    }
  },

  data() {
    return {
      publicKey: '',
      address: '',
      isLoggedIn: false
    }
  },

  async beforeMount() {
    this.isLoggedIn = authService.isLoggedIn();
    if (authService.isLoggedIn()) {
      console.log('Logged in');
      const sdk = new Eniblock({
        appId: "eniblock-demo",
        accessTokenProvider: () => Promise.resolve(localStorage.getItem('starter_sdk_vue_access_token') ?? ''),
        storage: new UnsafeStorage(),
      });
      if (!localStorage.getItem(`share-${sdk.appId}-ECDSA`)) {
        sdk.wallet.destroy();
      }
      const account = await sdk.account.instantiate('My first account');
      console.log(account);
      this.publicKey = account.getPublicKey();
      this.address = await account.getAddress();
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
