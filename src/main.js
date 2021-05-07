import Vue from "vue";
import Client from "shopify-buy";

const template = `
  <div class="media" v-if="product">
    <template v-if="product.images.length > 0">
      <div class="pull-sm-left col-sm-3">
        <img :src="product.images[0].src" class="img-responsive item-image">
      </div>
    </template>
    <div class="media-body">
      <h4 class="media-heading item-source">
        <a :href="product.onlineStoreUrl" target="_blank" rel="nofollow">
          {{ product.title }}
        </a>
      </h4>
      <div class="price">
        {{ price }}
      </div>
      <div class="item-body-hbr" v-html="product.descriptionHtml">
      </div>
      <div class="shopping">
        <form class="form-inline">
          <template v-if="product.variants.length > 1">
            <select class="form-control" name="variant" v-model="variantId">
              <option v-for="variant in product.variants" :value="variant.id">
                {{ variant.title }}
              </option>
            </select>
          </template>
          <template v-else>
            <input type="hidden" name="variant" v-model="variantId">
          </template>
          <input class="form-control" style="width:70px" type="number" name="quantity" min="1" v-model="quantity">
          <button class="btn btn-default" type="button" @click="checkout">
            <span :class="iconCheckout"></span>
            購入する
          </button>
        </form>
      </div>
    </div>
  </div>
`;

const cards = document.querySelectorAll(".shopify-card");

for (const card of cards) {
  card.innerHTML = "";
  var app = new Vue({
    data: function() {
      return {
        product: null,
        price: null,
        client: null,
        variantId: null,
        quantity: 1,
        progress: false,
      };
    },
    mounted: function() {
      this.client = Client.buildClient({
        domain: card.getAttribute("data-shopify-domain"),
        storefrontAccessToken: card.getAttribute("data-shopify-accesstoken"),
      });
      this.client.product
        .fetch(card.getAttribute("data-shopify-id"))
        .then((product) => {
          this.product = product;
          const prices = [];
          for (const variant of product.variants) {
            prices.push(parseInt(variant.price));
          }
          this.price = `￥${Math.min(...prices).toLocaleString()}`;
          if (Array.from(new Set(prices)).length > 1) {
            this.price += " 〜";
          }
          this.variantId = product.variants[0].id;
        });
    },
    computed: {
      iconCheckout: function() {
        return this.progress
          ? "fa fa-spinner fa-pulse fa-fw"
          : "fa fa-shopping-bag fa-fw";
      },
    },
    methods: {
      checkout: function() {
        this.progress = true;
        this.client.checkout.create().then((checkout) => {
          this.client.checkout
            .addLineItems(checkout.id, {
              variantId: this.variantId,
              quantity: parseInt(this.quantity),
            })
            .then((checkout) => {
              location.href = checkout.webUrl;
            });
        });
      },
    },
    template: template,
  });
  app.$mount();
  card.appendChild(app.$el);
}
