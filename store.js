import items from "./items.json";
import { finalProducts } from "./shoppingCart.js";
const productTemplate = document.querySelector("#store-product-template");
const productsContainer = document.querySelector("[data-products-container]");
const PRODUCT_URL = "https://dummyimage.com/420x260";

export let productsInCart = finalProducts || [];

export default function setupStore() {
  generateProduct(items);
  addToCart(productsInCart, finalProducts, items);
}

function generateProduct(products) {
  products.map((p) => {
    const productsTemplateClone = productTemplate.content.cloneNode(true);
    const product = productsTemplateClone.querySelector("[data-product-id]");
    product.dataset.productId = p.id;

    const img = productsTemplateClone.querySelector("[data-product-img]");
    img.src = `${PRODUCT_URL}/${p.imageColor}/${p.imageColor}`;

    const category = productsTemplateClone.querySelector(
      "[data-product-category]"
    );
    category.innerText = p.category;

    const name = productsTemplateClone.querySelector("[data-product-name]");
    name.innerText = p.name;

    const price = productsTemplateClone.querySelector("[data-product-price]");
    price.innerText = `$${(p.priceCents / 100).toFixed(2)}`;

    if (productsContainer == null) return;
    productsContainer.appendChild(productsTemplateClone);
  });
}

function addToCart(addingToCart, expandingCart, selectingFrom) {
  if (productsContainer == null) return;
  productsContainer.addEventListener("click", (e) => {
    if (!e.target.matches("[data-add-to-cart]")) return;
    const parentElementId = e.target.closest("[data-product-id]");
    if (expandingCart.length === 0) {
      let finding = !addingToCart.find(
        (product) => product.id == parentElementId.dataset.productId
      );
      if (finding) {
        selectingFrom.map((item) => {
          if (item.id == parentElementId.dataset.productId) {
            addingToCart.push(item);
            item.quantity = 1;
          }
        });
      } else {
        addingToCart.map((product) => {
          if (product.id == parentElementId.dataset.productId) {
            product.quantity++;
          }
        });
      }
    } else {
      let finding = !expandingCart.find(
        (product) => product.id == parentElementId.dataset.productId
      );

      if (finding) {
        selectingFrom.map((item) => {
          if (item.id == parentElementId.dataset.productId) {
            expandingCart.push(item);
            item.quantity = 1;
          }
        });
      } else {
        expandingCart.map((product) => {
          if (product.id == parentElementId.dataset.productId) {
            product.quantity++;
          }
        });
      }
    }
  });
  return addingToCart;
}
