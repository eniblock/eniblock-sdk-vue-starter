<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <button v-on:click="login" v-if="!isLoggedIn()">Login to create a wallet</button>
    <p v-if="isLoggedIn()">
      Your wallet and your account are instantiated<br>
      Your public key : {{ publicKey }}<br>
      Your address : {{ address }}<br>
      You can check your console to see the detail of these objects.
    </p>

    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank"
             rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank"
             rel="noopener">eslint</a></li>
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

<script>
import {Account, Eniblock, UnsafeStorage, Wallet} from "@eniblock/sdk";
import authService from "@/services/authService";

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data: function () {
    return {
      sdk: new Eniblock({
        authConfig: {
          clientId: process.env.AUTH_CLIENT_ID,
          redirectUrl: process.env.AUTH_REDIRECT_URI,
        },
        tssConfig: {
          kmsUrl: "https://sdk.eniblock.com",
          wasmPath: "wasm/eniblock.wasm",
          kmsVerify: true,
        },
        storageItems: [{alias: "LocalStorage", storage: new UnsafeStorage()}],
      }),
      account: Account,
      wallet: Wallet,
      publicKey: '',
      address: '',
    };
  },
  methods: {
    login: function () {
      return authService.login();
    },
    isLoggedIn: function () {
      return authService.isLoggedIn();
    }
  },
  async beforeMount() {
    if (authService.isLoggedIn()) {
      console.log('Logged in');
      this.wallet = await this.sdk.wallet.instantiate();
      console.log(this.wallet);
      this.account = await this.wallet.account.instantiate('My first account');
      console.log(this.account);
      this.publicKey = await this.account.getPublicKey();
      this.address = await this.account.getAddress();
    }
  }
}
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
