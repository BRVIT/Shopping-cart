import { productsInCart } from "./store.js";

const cartTemplate = document.querySelector("#store-cart-template");
const CART_IMG_URL = "https://dummyimage.com/210x130/";
const cartContainer = document.querySelector("[data-cart-container]");
const productsContainer = document.querySelector("[data-products-container]");
const cartContainerMain = document.querySelector("[data-cart-container-main]");
// Cart
const cart = document.querySelector("[data-cart]");
const cartItems = cart.querySelector("[data-cart-items]");
const totalPrice = cartContainerMain.querySelector("[data-cart-final-price]");
// Session storage
const SESSION_STORAGE_PREFIX = "SHOPPING_CART";
const CART_STORAGE_KEY = `${SESSION_STORAGE_PREFIX}-cart`;
const itemsInCart = loadItemsSession();

const ids = [];
let finalPrice = 0;
export let finalProducts = itemsInCart || [];
export default function setupShoppingCart() {
  renderStorage(finalProducts);
  renderCart(finalProducts);
  deleteItems(finalProducts);
  deleteIds(ids);
  showingCart();
}

function renderCart(products) {
  if (productsContainer == null) return;
  productsContainer.addEventListener("click", (e) => {
    console.log(finalProducts);
    if (!e.target.matches("[data-add-to-cart]")) return;
    const cartTemplateClone = cartTemplate.content.cloneNode(true);
    const id = cartTemplateClone.querySelector("[data-cart-id]");
    const img = cartTemplateClone.querySelector("[data-cart-img]");
    const name = cartTemplateClone.querySelector("[data-cart-name]");
    const quantity = cartTemplateClone.querySelector("[data-cart-quantity]");
    const price = cartTemplateClone.querySelector("[data-cart-price]");

    saveItemsSession();
    cartItems.innerText = products.length;

    finalPrice = products.reduce((total, item) => {
      return total + item.priceCents * item.quantity;
    }, 0);

    totalPrice.innerText = `$${(finalPrice / 100).toFixed(2)}`;

    products.map((product) => {
      if (!ids.includes(product.id)) {
        if (!ids.find((id) => id == product.id)) {
          ids.push(product.id);
        }

        id.dataset.cartId = product.id;
        img.src = `${CART_IMG_URL}/${product.imageColor}/${product.imageColor}`;
        name.innerText = product.name;
        quantity.innerText = `x${product.quantity}`;
        price.innerText = `$${(product.priceCents / 100).toFixed(2)}`;
        cartContainer.appendChild(cartTemplateClone);
      } else {
        let parent = e.target.closest("body");
        let childs = parent.querySelectorAll("[data-cart-id]");

        childs.forEach((child) => {
          let quantity = child.querySelector("[data-cart-quantity]");
          let price = child.querySelector("[data-cart-price");
          if (child.dataset.cartId == product.id) {
            quantity.innerText = `x${product.quantity}`;
            price.innerText = `$${(
              product.quantity *
              (product.priceCents / 100)
            ).toFixed(2)}`;
          }
        });
      }
    });
    if (ids.length > 0) {
      cart.classList.remove("invisible");
    }
  });
}

function deleteItems(items) {
  cartContainer.addEventListener("click", (e) => {
    if (!e.target.matches("[data-remove-from-cart-button]")) return;
    const idElement = e.target.closest("[data-cart-id]");

    let objWithIndex = items.findIndex(
      (item) => item.id == idElement.dataset.cartId
    );

    if (objWithIndex > -1) {
      items.splice(objWithIndex, 1);
      finalProducts = items;
      idElement.remove();
      renderStorage(items);
      saveItemsSession();
      console.log(items);
    }

    finalPrice = items.reduce((total, item) => {
      return total - item.priceCents * item.quantity;
    }, 0);
    totalPrice.innerText = `$${(-(finalPrice / 100)).toFixed(2)}`;
    cartItems.innerText = items.length;
  });
}

function deleteIds(id) {
  cartContainer.addEventListener("click", (e) => {
    if (!e.target.matches("[data-remove-from-cart-button]")) return;
    const idElement = e.target.closest("[data-cart-id]");

    let index = id.findIndex((num) => num == idElement.dataset.cartId);
    id.splice(index, 1);

    if (ids.length === 0) {
      cart.classList.add("invisible");
      cartContainerMain.classList.add("invisible");
    }
  });
}

function showingCart() {
  cart.addEventListener("click", () => {
    cartContainerMain.classList.toggle("invisible");
  });
}

function saveItemsSession() {
  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(productsInCart));
}

function loadItemsSession() {
  const itemsString = sessionStorage.getItem(CART_STORAGE_KEY);
  return JSON.parse(itemsString) || [];
}

function renderStorage(products) {
  if (products.length == 0) return;
  cart.classList.remove("invisible");
  cartContainerMain.classList.remove("invisible");
  products.map((product) => {
    if (!ids.includes(product.id)) {
      if (!ids.find((id) => id == product.id)) {
        ids.push(product.id);
      }
      finalPrice = products.reduce((total, item) => {
        return total + item.priceCents * item.quantity;
      }, 0);

      const cartTemplateClone = cartTemplate.content.cloneNode(true);
      const id = cartTemplateClone.querySelector("[data-cart-id]");
      const img = cartTemplateClone.querySelector("[data-cart-img]");
      const name = cartTemplateClone.querySelector("[data-cart-name]");
      const quantity = cartTemplateClone.querySelector("[data-cart-quantity]");
      const price = cartTemplateClone.querySelector("[data-cart-price]");
      id.dataset.cartId = product.id;
      img.src = `${CART_IMG_URL}/${product.imageColor}/${product.imageColor}`;
      name.innerText = product.name;
      quantity.innerText = `x${product.quantity}`;
      price.innerText = `$${(product.priceCents / 100).toFixed(2)}`;
      cartContainer.appendChild(cartTemplateClone);
      cartItems.innerText = products.length;
      totalPrice.innerText = `$${(finalPrice / 100).toFixed(2)}`;
    }
  });
}
