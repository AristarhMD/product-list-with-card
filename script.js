import desserts from "./data.json" with { type: "json" };
console.log(desserts);
const articleContainer = document.querySelector(".article-container");
const cartCounter = document.querySelector(".cart-counter");
const cartContainer = document.querySelector(".cart-container");
const initialData = [];
const cart = [];

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
                    class="rounded-lg"
                    src="${dessert.image.mobile}"
                    alt="waffle photos"
                  />
                </picture>
                <button
                  class="cart-button flex items-center mx-auto gap-2 py-3 px-7 border border-rose-400 rounded-full cursor-pointer relative z-10 bg-white -mt-6.25"
                  data-id="${dessert.name}"
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
                  <p>Add to Cart</p>
                </button>
              </div>
              <div>
                <p class="preset-4 text-rose-500">${dessert.category}</p>
                <p class="preset-3 text-rose-900">${dessert.name}</p>
                <p class="preset-3 text-red">$${dessert.price.toFixed(2)}</p>
              </div>
            </article>`;

  initialData.push(articleEl);
});

function initialization() {
  articleContainer.innerHTML = initialData.join("");
  const addToCartBtns = document.querySelectorAll(".cart-button");
  addToCartBtns.forEach((addToCartBtn) => {
    addToCartBtn.addEventListener("click", function () {
      // console.log(this.dataset.id);
      addToCart(this.dataset.id);
    });
  });
}

initialization();

function addToCart(name) {
  desserts.forEach((desert) => {
    if (desert.name === name) {
      const index = cart.findIndex((item) => item.name === name);

      if (index !== -1) {
        cart[index].quantity = cart[index].quantity + 1;
      } else {
        cart.push({ ...desert, quantity: 1 });
      }
    }
    return;
  });

  console.log(cart);
  renderCart();
}

function renderCart() {
  console.log(cart.length);
  cartCounter.textContent = `${cart.length}`;
  cartContainer.classList.remove("py-4");
  let cartHtml = [];
  cart.forEach((cartItem) => {
    let cartItemHtml = `
    <article class="w-full first:py-0 first:pb-4 py-4 last:border-none border-b border-rose-100 flex flex justify-between items-center">
        <div class="flex flex-col gap-2">
            <p class="preset-4-bold text-rose-900" >${cartItem.name}</p>
            <div class="flex itemes-center justify-start gap-2">
                <p class="preset-4-bold text-red">${cartItem.quantity}x</p>
                <p class="preset-4 text-rose-500">@ $${cartItem.price.toFixed(2)}</p>
                <p class="preset-4-bold text-rose-500">$${(cartItem.price * cartItem.quantity).toFixed(2)}</p>
            </div>
        </div>
        <button class="p-1 border border-rose-400 rounded-full cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg></button>
      </article>`;
    cartHtml.push(cartItemHtml);
  });

  cartContainer.innerHTML = cartHtml.join("");
}
