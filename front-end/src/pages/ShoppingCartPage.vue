<template>
  <h1>Shopping Cart</h1>
  <ShoppingCartList @remove-from-cart="removeFromCart($event)" :cartItems="cartItems"/>
  
</template>

<script>
import axios from 'axios';
import ShoppingCartList from '@/components/ShoppingCartList.vue';

export default {
  name: 'ShoppingCartPage',
  props: ['user'],
  data () {
    return {
      cartItems: [],
    }
  },
  methods: {
    async removeFromCart (productId){
        const response = await axios.delete(`/api/users/${this.user.uid}/cart/${productId}`);
        const updatedCart = response.data;
        this.cartItems = updatedCart;
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
  components: {
    ShoppingCartList
  },
  async created(){
    if(this.user){
      const response = await axios.get(`/api/users/${this.user.uid}/cart`);
      const cartItems = response.data;
      this.cartItems = cartItems;
    }
  }
}
</script>