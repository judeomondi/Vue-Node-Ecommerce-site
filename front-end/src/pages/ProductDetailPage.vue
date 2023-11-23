<template>
  <div v-if="product">
    <div class="img-wrap">
    <img :src="product.imageUrl"/>
    </div>

    <div class="product-details">
      <h1>{{ product.name }}</h1>
      <h3 class="price">{{ product.price }}</h3>
      <button @click="addToCart" class="add-to-cart" v-if="user && !itemsInCart"> Add to cart</button>
      <button class="grey-button" v-if="user && itemsInCart">Item Already In Cart</button>
      <button class="sign-in" @click="signIn" v-if="!user">Sign in with email to add to cart</button>
    </div>
  </div>

  <div v-else>

    <NotFoundPage/>

  </div>
  
</template>

<script>
import NotFoundPage from '@/pages/NotFoundPage.vue';
import axios from 'axios';
import {getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink} from 'firebase/auth';


export default {
    name: "ProductDetailPage",
    data() {
        return {
            product: {},
            cartItems: []
        };
    },
    props: ['user'],
    computed: {
        itemsInCart(){
          return this.cartItems.some(item => item.id === this.$route.params.productId);
        }
    },
    watch: {
      async user(newUserValue) {
        if(newUserValue){
        const cartItemResponse = await axios.get(`/api/users/${newUserValue.uid}/cart`);
        const cartItems = cartItemResponse.data;
        this.cartItems = cartItems;
        }
      }
    },
    methods: {
        async addToCart (){
          await axios.post('/api/users/12345/cart', {id: this.$route.params.productId});
          alert ('Successfully added product to cart!');
        },
        async signIn(){
          const email = prompt('Enter your email to sign in');
          const auth = getAuth();
          const actionCodeSettings = {
            url: `https://two-trees-deployment.onrender.com/product/${this.$route.params.productId}`,
            handleCodeInApp: true
          }
          await sendSignInLinkToEmail(auth, email, actionCodeSettings);
          alert('A login link has been sent to your email');
          window.localStorage.setItem('emailToSignIn', email);
        }
    },
    components: { NotFoundPage },
    async created(){

      const auth = getAuth();
      if(isSignInWithEmailLink(auth, window.location.href)){
        const email = window.localStorage.getItem('emailToSignIn');
        await signInWithEmailLink(auth, email, window.location.href);
        alert('Successfully signed in!');
        window.localStorage.removeItem('emailToSignIn');
      }


      const response = await axios.get(`/api/product/${this.$route.params.productId}`);
      const product = response.data;
      this.product = product;

      if(this.user){
        const cartItemResponse = await axios.get(`/api/users/${this.user.uid}/cart`);
        const cartItems = cartItemResponse.data;
        this.cartItems = cartItems;
      }
    }
}
</script>