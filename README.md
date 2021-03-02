# Sandbox for Clipkit Shopify

ES6+とVue.jsをビルドできる、最小限のWebpack環境です。
ClipkitのShopifyアイテムの表示カスタマイズの作業に利用できます。

## 準備

```
% git clone git@github.com:miyamae/sandbox-clipkit-shopify.git
% cd sandbox-clipkit-shopify
```

## 起動

```
% docker-compose up
```
http://localhost:8080/ でアクセスできます。

src/main.jsを編集すると、自動コンパイル＆ホットリロードされます。

## ビルド

docker-compose up が起動している状態で実行します。

```
% docker-compose exec app yarn build
```

生成された `dist/js/chunk-vendors.*.js` `dist/js/app.*.js` の2つをClipkitデフォルトの `item-shopify-1.0.js` に置き換えて `</body>` の前に配置してください。

例）
```
  <script src="{% file 'chunk-vendors.16fa0020.js'}"></script>
  <script src="{% file 'app.0178ce90.js'}"></script>
</body>
```
