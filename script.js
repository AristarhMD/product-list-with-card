import desserts from "./data.json" with { type: "json" };

const articleContainer = document.querySelector(".article-container");
const cartCounter = document.querySelector(".cart-counter");
const cartContainer = document.querySelector(".cart-container");
const completeOrderDiv = document.querySelector(".complet-order");
const completCartItems = document.querySelector(".complete-cart-items");
const completeCartPrice = document.querySelector(".complet-cart-price");
const newOrderBtn = document.querySelector(".new-order");

let cart = [];

initialization();

function initialization() {
  // Generate main desserts cards on the page
  let mainDessertsCards = initialDessertsCards();
  // Insert cards to the page
  articleContainer.innerHTML = mainDessertsCards;

  // Add eventlistener for each add to card btn from main desserts card.
  addToCardListeners();

  // Add eventlisteners to increment/decrement qty of the dessert
  decrementQty();
  incrementQty();
}

function initialDessertsCards() {
  const initialData = [];
  desserts.forEach((dessert) => {
    let articleEl = `
    <article class="flex flex-col gap-4">
              <div>
                <picture>
                  <source
                    media="(min-width:1220px )"
                    srcset="${dessert.image.desktop}"
                  />
                  <source
                    media="(min-width:768px )"
                    srcset="${dessert.image.tablet}"
                  />
                  <img
                    class="dessert-img rounded-lg"
                    src="${dessert.image.mobile}"
                    alt="waffle photos"
                    data-img="${dessert.name}"
                  />
                </picture>

                <div class="btn-container flex flex-col items-center z-10 -mt-6.25">

                  <div class="cart-quantity p-3 bg-red flex items-center justify-between w-40 border border-red rounded-full hidden">

                    <button class="qty-decrease w-5 h-5 border-2 border-white rounded-full flex justify-center items-center cursor-pointer">

                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>

                    </button>

                    <p class="cart-quantity-info preset-4 text-white" >0</p>

                    <button class="qty-increase w-5 h-5 border-2 border-white rounded-full flex justify-center items-center cursor-pointer">

                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>

                    </button>

                  </div>
                  

                  <button
                    class="cart-button flex items-center justify-center mx-auto gap-2 p-3 border border-rose-400 rounded-full cursor-pointer text-rose-900 relative bg-white w-40 hover:border-red hover:text-red"
                    data-dessert="${dessert.name}"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="20"
                      fill="none"
                      viewBox="0 0 21 20"
                    >
                      <g fill="#C73B0F" clip-path="url(#a)">
                        <path
                          d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"
                        />
                        <path
                          d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"
                        />
                      </g>
                      <defs>
                        <clipPath id="a">
                          <path fill="#fff" d="M.333 0h20v20h-20z" />
                        </clipPath>
                      </defs>
                    </svg>
                    <p class="preset-4-bold text-inherit">Add to Cart</p>
                  </button>
              
                </div>
              </div>
              <div>
                <p class="preset-4 text-rose-500">${dessert.category}</p>
                <p class="preset-3 text-rose-900">${dessert.name}</p>
                <p class="preset-3 text-red">$${dessert.price.toFixed(2)}</p>
              </div>
            </article>`;

    initialData.push(articleEl);
  });
  return initialData.join("");
}

function addToCardListeners() {
  const addToCartBtns = document.querySelectorAll(".cart-button");
  addToCartBtns.forEach((addToCartBtn) => {
    addToCartBtn.addEventListener("click", function () {
      addToCart(this.dataset.dessert);
      changeAddToCardBtn(this);
      renderCart();
    });
  });
}

function findItemInTheCar(dessertName) {
  const dessertInTheCard = cart.find((dessert) => dessert.name === dessertName);
  return dessertInTheCard;
}

function addToCart(dessertName) {
  let dessertInTheCard = findItemInTheCar(dessertName);

  if (!dessertInTheCard) {
    let addedDessert = desserts.find((dessert) => dessert.name === dessertName);
    cart.push({ ...addedDessert, quantity: 1 });
  } else if (dessertInTheCard) {
    dessertInTheCard.quantity++;
  } else {
    return;
  }
}

function getRequestedEls(el) {
  let parrentArticle = el.closest("article");
  let articleImg = parrentArticle.querySelector("img");
  let incrementDecrementDiv = parrentArticle.querySelector(".cart-quantity");
  let cartQty = parrentArticle.querySelector(".cart-quantity-info");
  let dessertName =
    parrentArticle.querySelector(".cart-button").dataset.dessert;
  let addToCartBtn = parrentArticle.querySelector(".cart-button");

  return [
    articleImg,
    incrementDecrementDiv,
    cartQty,
    dessertName,
    addToCartBtn,
  ];
}

function changeAddToCardBtn(button) {
  let dessertName = button.dataset.dessert;
  let qty = findItemInTheCar(dessertName).quantity;

  let [articleImg, qtyCartDiv = incrementDecrementDiv, qtyCartText = cartQty] =
    getRequestedEls(button);

  if (!articleImg.classList.contains("ring-2")) {
    articleImg.classList.add("ring-2");
    articleImg.classList.add("ring-red");
    qtyCartDiv.classList.remove("hidden");
    button.classList.add("hidden");
    qtyCartText.textContent = qty;
  } else {
    return;
  }
}

function decrementQty() {
  // Selecting all decrement btns
  let decrementQty = document.querySelectorAll(".qty-decrease");

  // Looping over decrement btns and add logic of it
  decrementQty.forEach((decrement) => {
    decrement.addEventListener("click", function () {
      let [
        articleImg,
        incrementDecrementDiv,
        cartQty,
        dessertName,
        addToCartBtn,
      ] = getRequestedEls(decrement);

      let cartItem = findItemInTheCar(dessertName);
      cartItem.quantity--;

      if (cartItem.quantity <= 0) {
        addToCartBtn.classList.remove("hidden");
        incrementDecrementDiv.classList.add("hidden");
        articleImg.classList.remove("ring-2");

        cart = cart.filter((item) => item.quantity > 0);
        cartQty.textContent = "0";
      } else {
        cartQty.textContent = cartItem.quantity;
      }
      renderCart();
    });
  });
}

function incrementQty() {
  // Selecting all increment btns
  let incrementQty = document.querySelectorAll(".qty-increase");

  // Looping over increment btns and add logic of it
  incrementQty.forEach((increment) => {
    increment.addEventListener("click", function () {
      let [
        _articleImg,
        _incrementDecrementDiv,
        cartQty,
        dessertName,
        _addToCartBtn,
      ] = getRequestedEls(increment);

      let cartItem = findItemInTheCar(dessertName);

      cartItem.quantity++;
      cartQty.textContent = cartItem.quantity;
      renderCart();
    });
  });
}

function renderCart() {
  // General
  let cartHtml = [];

  let totalPrice = cart
    .reduce((prev, curr) => (prev = curr.price * curr.quantity + prev), 0)
    .toFixed(2);

  let footerCart = `
    <hr class="bg-rose-100">
    
    <p class="w-full preset-4 text-rose-900 flex justify-between items-center">Order Total
    <span class="preset-2">$${totalPrice}</span></p>

    <div class="w-full bg-rose-50 rounded-2xl p-4 flex items-center justify-center gap-2">

    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><path fill="#1EA575" d="M8 18.75H6.125V17.5H8V9.729L5.803 8.41l.644-1.072 2.196 1.318a1.256 1.256 0 0 1 .607 1.072V17.5A1.25 1.25 0 0 1 8 18.75Z"/><path fill="#1EA575" d="M14.25 18.75h-1.875a1.25 1.25 0 0 1-1.25-1.25v-6.875h3.75a2.498 2.498 0 0 0 2.488-2.747 2.594 2.594 0 0 0-2.622-2.253h-.99l-.11-.487C13.283 3.56 11.769 2.5 9.875 2.5a3.762 3.762 0 0 0-3.4 2.179l-.194.417-.54-.072A1.876 1.876 0 0 0 5.5 5a2.5 2.5 0 1 0 0 5v1.25a3.75 3.75 0 0 1 0-7.5h.05a5.019 5.019 0 0 1 4.325-2.5c2.3 0 4.182 1.236 4.845 3.125h.02a3.852 3.852 0 0 1 3.868 3.384 3.75 3.75 0 0 1-3.733 4.116h-2.5V17.5h1.875v1.25Z"/></svg>
    <p class="preset-4">This is a <span class="preset-4-bold">carbon-neutral</span> delivery</p>

    </div>

    <button class="confirm-order w-full overflow-hidden py-4 bg-red rounded-full cursor-pointer relative before:absolute before:content-[''] before:inset-0 before:bg-black/25 before:opacity-0 hover:before:opacity-100">
    <span class="relative z-10 text-white preset-3">Confirm Order</span>
    </button>
    `;

  cartCounter.textContent = `${cart.length}`;
  cartContainer.classList.remove("py-4");

  // Initial state of the cart
  const initialState = ` <svg
              xmlns="http://www.w3.org/2000/svg"
              width="128"
              height="128"
              fill="none"
              viewBox="0 0 128 128"
            >
              <path
                fill="#260F08"
                d="M8.436 110.406c0 1.061 4.636 2.079 12.887 2.829 8.252.75 19.444 1.171 31.113 1.171 11.67 0 22.861-.421 31.113-1.171 8.251-.75 12.887-1.768 12.887-2.829 0-1.061-4.636-2.078-12.887-2.828-8.252-.75-19.443-1.172-31.113-1.172-11.67 0-22.861.422-31.113 1.172-8.251.75-12.887 1.767-12.887 2.828Z"
                opacity=".15"
              />
              <path
                fill="#87635A"
                d="m119.983 24.22-47.147 5.76 4.32 35.36 44.773-5.467a2.377 2.377 0 0 0 2.017-1.734c.083-.304.104-.62.063-.933l-4.026-32.986Z"
              />
              <path
                fill="#AD8A85"
                d="m74.561 44.142 47.147-5.754 1.435 11.778-47.142 5.758-1.44-11.782Z"
              />
              <path
                fill="#CAAFA7"
                d="M85.636 36.78a2.4 2.4 0 0 0-2.667-2.054 2.375 2.375 0 0 0-2.053 2.667l.293 2.347a3.574 3.574 0 0 1-7.066.88l-1.307-10.667 14.48-16.88c19.253-.693 34.133 3.6 35.013 10.8l1.28 10.533a1.172 1.172 0 0 1-1.333 1.307 4.696 4.696 0 0 1-3.787-4.08 2.378 2.378 0 1 0-4.72.587l.294 2.346a2.389 2.389 0 0 1-.484 1.755 2.387 2.387 0 0 1-1.583.899 2.383 2.383 0 0 1-1.755-.484 2.378 2.378 0 0 1-.898-1.583 2.371 2.371 0 0 0-1.716-2.008 2.374 2.374 0 0 0-2.511.817 2.374 2.374 0 0 0-.493 1.751l.293 2.373a4.753 4.753 0 0 1-7.652 4.317 4.755 4.755 0 0 1-1.788-3.17l-.427-3.547a2.346 2.346 0 0 0-2.666-2.053 2.4 2.4 0 0 0-2.08 2.667l.16 1.173a2.378 2.378 0 1 1-4.72.587l-.107-1.28Z"
              />
              <path
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width=".974"
                d="m81.076 28.966 34.187-4.16"
              />
              <path
                fill="#87635A"
                d="M7.45 51.793c-.96 8.48 16.746 17.44 39.466 19.947 22.72 2.506 42.08-2.16 43.04-10.667l-3.947 35.493c-.96 8.48-20.24 13.334-43.04 10.667S2.463 95.74 3.423 87.18l4.026-35.387Z"
              />
              <path
                fill="#AD8A85"
                d="M5.823 65.953c-.96 8.453 16.746 17.44 39.573 20.027 22.827 2.586 42.053-2.187 43.013-10.667L87.076 87.1c-.96 8.48-20.24 13.333-43.04 10.666C21.236 95.1 3.53 86.22 4.49 77.74l1.334-11.787Z"
              />
              <path
                fill="#CAAFA7"
                d="M60.836 42.78a119.963 119.963 0 0 0-10.347-1.627c-24-2.667-44.453 1.893-45.333 10.373l-2.133 18.88a3.556 3.556 0 1 0 7.066.8 3.574 3.574 0 1 1 7.094.8l-.8 7.094a5.93 5.93 0 1 0 11.786 1.333 3.556 3.556 0 0 1 7.067.8l-.267 2.347a3.573 3.573 0 0 0 7.094.826l.133-1.2a5.932 5.932 0 1 1 11.787 1.36l-.4 3.52a3.573 3.573 0 0 0 7.093.827l.933-8.267a1.174 1.174 0 0 1 1.307-.906 1.146 1.146 0 0 1 1.04 1.306 5.947 5.947 0 0 0 11.813 1.334l.534-4.72a3.556 3.556 0 0 1 7.066.8 3.573 3.573 0 0 0 7.094.826l1.786-15.546a2.373 2.373 0 0 0-2.08-2.667L44.143 55.74l16.693-12.96Z"
              />
              <path
                fill="#87635A"
                d="m59.156 57.66 1.68-14.88-16.827 13.173 15.147 1.707Z"
              />
              <path
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width=".974"
                d="M9.796 52.06c-.667 5.866 16.24 12.586 37.733 15.04 14.774 1.68 27.867.906 34.854-1.654"
              />
            </svg>
            <p class="preset-4-bold text-rose-500">
              Your added items will appear here
            </p>`;

  // Formating the cart display
  if (cart.length === 0) {
    cartContainer.innerHTML = initialState;
  } else {
    cartHtml = cart.map((cartItem, idx, arr) => {
      let cartItemHtml = `
    <article  class="w-full first:py-0 first:pb-4 py-4 last:border-none border-b border-rose-100 flex flex justify-between items-center" ">
        <div class="flex flex-col gap-2">
            <p class="preset-4-bold text-rose-900" >${cartItem.name}</p>
            <div class="flex itemes-center justify-start gap-2">
                <p class="preset-4-bold text-red">${cartItem.quantity}x</p>
                <p class="preset-4 text-rose-500">@ $${cartItem.price.toFixed(2)}</p>
                <p class="preset-4-bold text-rose-500">$${(cartItem.price * cartItem.quantity).toFixed(2)}</p>
            </div>
        </div>
        <button class="delet-from-cart group hover:border-rose-900 p-1 border border-rose-400 rounded-full cursor-pointer" data-id="${cartItem.name}"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path class="group-hover:fill-rose-900" fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg></button>
      </article>`;

      if (idx === arr.length - 1) {
        cartItemHtml += footerCart;
      }

      return cartItemHtml;
    });

    cartContainer.innerHTML = cartHtml.join("");
    eventDelete();
    confirmOrder();
  }
}

function eventDelete() {
  const deleteFromCartBtns = document.querySelectorAll(".delet-from-cart");
  const desertImg = document.querySelectorAll(".dessert-img");

  deleteFromCartBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", function () {
      const indexInCart = cart.findIndex(
        (item) => item.name === deleteBtn.dataset.id,
      );

      let newCart = cart.filter((_, indx) => indx !== indexInCart);
      cart = [...newCart];

      desertImg.forEach((img) => {
        if (img.dataset.img === deleteBtn.dataset.id) {
          const parentContainer = img.closest("article");

          parentContainer
            .querySelector(".cart-button")
            .classList.remove("hidden");
          parentContainer
            .querySelector(".cart-quantity")
            .classList.add("hidden");
          parentContainer.querySelector("img").classList.remove("ring-2");
          parentContainer.querySelector(".cart-quantity-info").textContent =
            "0";
        }
      });
      renderCart();
    });
  });
}

function confirmOrder() {
  const confirmOrderBtn = document.querySelector(".confirm-order");

  confirmOrderBtn.addEventListener("click", () => {
    // Calculating total price
    const totalBill = cart
      .reduce((prev, curr) => (prev += curr.price * curr.quantity), 0)
      .toFixed(2);

    // Creating card for each item in cart
    const completOrderCards = cart.map((item, indx) => {
      let card = `
    <article class="w-full flex items-center justify-start">
      <div class="w-12 h-12 flex rounded overflow-hidden mr-4 basis-12 shrink-0">
        <img src=${item.image.thumbnail}>
      </div>

      <div class="min-w-30 flex flex-col gap-2 items-center justify-start mr-2 ">
        <p class="w-full preset-4-bold text-rose-900 truncate">${item.name}</p>
        <p class="preset-4-bold text-red flex gap-2 mr-auto">${item.quantity}x<span class="preset-4 text-rose-500">@ $${item.price.toFixed(2)}</span></p>
      </div>

      <p class="ml-auto preset-3 text-rose-900 basis-content">$${(item.price * item.quantity).toFixed(2)}</p>
    
    </article>`;

      if (cart.length > 1 && indx < cart.length - 1) {
        card += `<hr class="border-rose-100" />`;
      }
      return card;
    });

    completeOrderDiv.classList.remove("hidden");
    completCartItems.innerHTML = completOrderCards.join("");
    completeCartPrice.textContent = `$${totalBill}`;
  });
}

newOrderBtn.addEventListener("click", () => {
  initialization();
  completeOrderDiv.classList.add("hidden");
  cart = [];
  renderCart();
});
