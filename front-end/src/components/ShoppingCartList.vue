<template>

    <div v-if="cartItems.length > 0">

    <div class="product-container" v-for="product in cartItems" :key="product.id">

    <img class="product-image" :src="product.imageUrl" />
    <div class="details-wrap">
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }}</p>
    </div>
    <button @click="$emit('remove-from-cart', product.id)" class="remove-button">Remove from cart</button>
    </div>

    <button class="checkout-button">Checkout</button>
    </div>

    <div v-if="cartItems.length === 0">
    You currently have no items in cart!
    </div>

</template>

<script>
    
    export default {

        name: 'ShoppingCartList',
        props: ['cartItems']

    }
</script>