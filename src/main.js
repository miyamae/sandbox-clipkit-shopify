import Vue from 'vue'
import Client from 'shopify-buy'

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
        <a class="btn btn-default" :href="product.onlineStoreUrl" target="_blank" rel="nofollow">
          <span class="fa fa-shopping-cart"></span>
          販売サイトへ
        </a>
      </div>
    </div>
  </div>
`

const cards = document.querySelectorAll('.shopify-card')

for (const card of cards) {
  card.innerHTML = ''
  var app = new Vue({
    data: function () {
      return {
        product: null,
        price: null
      }
    },
    mounted: function () {
      const client = Client.buildClient({
        domain: card.getAttribute('data-shopify-domain'),
        storefrontAccessToken: card.getAttribute('data-shopify-accesstoken')
      })
      client.product.fetch(card.getAttribute('data-shopify-id')).then((product) => {
        this.product = product
        const prices = []
        for (const variant of product.variants) {
          prices.push(parseInt(variant.price))
        }
        this.price = `￥${Math.min(...prices).toLocaleString()}`
        if (Array.from(new Set(prices)).length > 1) {
          this.price += ' 〜'
        }
      })
    },
    template: template
  })
  app.$mount()
  card.appendChild(app.$el)
}
