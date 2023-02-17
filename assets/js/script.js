//Mostrar y ocultar carrito.
const carToggle = document.querySelector(".car__toggle");
const carBlock = document.querySelector(".car__block");
// URL para petición AXIOS.
const baseURL = "https://academlo-api-production.up.railway.app/api";
const productsList = document.querySelector("#products-container");
//Carrito
const car = document.querySelector("#car");
const carList = document.querySelector("#car__list");
const emptyCarButton = document.querySelector("#empty__car");
let carProducts = [];
// Lógica para mostrar y ocultar el carrito.
carToggle.addEventListener("click", () => {
  carBlock.classList.toggle("nav__car__visible");
});
//Listeners
eventListenersLoader();
function eventListenersLoader() {
  //* Se ejecuta cuando se presione el botón "Add to car"
  productsList.addEventListener("click", captureProduct);
  //* Se ejecuta cuando se presione el botón "delate"
  car.addEventListener("click", removeProduct);
  //* Se ejecuta cuando se presione el botón "Empty Car"
  emptyCarButton.addEventListener("click", emptyCar);
  // Se ejecuta al recargar la pagina
  document.addEventListener("DOMContentLoaded", () => {
    carProducts = JSON.parse(localStorage.getItem("car")) || [];
    carElementsHTML();
  });
}
// Petición GET.
function getProducts() {
  axios
    .get(`${baseURL}/products`)
    .then(function (response) {
      const products = response.data; //Llegan como respuesta desde API
      printProducts(products); //Lo envia a la función que renderizará
    })
    .catch(function (error) {
      console.log(error);
    });
}
getProducts();
//Imprimir productos dentro de la web
function printProducts(products) {
  let html = "";
  for (let i = 0; i < products.length; i++) {
    html += `
    <div class="product__container">
            <div class="product__container__img">
                <img src="${products[i].images.image1}" alt="">
            </div>
            <div class="product__container__name">
                <p>${products[i].name}</p>
            </div>
            <div class="product__container__price">
                <p>$ ${products[i].price.toFixed(2)}</p>
            </div>
            <div class="product__container__button">
                <button class="car__button add__to__car" id="add__to__car" data-id="${
                  products[i].id
                }">Add to car</button>
            </div>
        </div>
        `;
  }
  productsList.innerHTML = html;
}
//Agregar productos al carrito

// Captura la información de productos clikeados
function captureProduct(e) {
  if (e.target.classList.contains("add__to__car")) {
    const product = e.target.parentElement.parentElement; //parentElemente me permite escalar las etiquetas, accediendo al padre, y al padre del padre.
    carProductsElements(product);
  }
}
// Tranformar la información html en un array de objetos
function carProductsElements(product) {
  const infoProduct = {
    id: product.querySelector("button").getAttribute("data-id"),
    image: product.querySelector("img").src,
    name: product.querySelector(".product__container__name p").textContent,
    price: product.querySelector(".product__container__price p").textContent,
    quantity: 1,
  };
  //* Agregar contador
  if (carProducts.some((product) => product.id === infoProduct.id)) {
    const product = carProducts.map((product) => {
      if (product.id === infoProduct.id) {
        product.quantity++;
        return product;
      } else {
        return product;
      }
    });
    carProducts = [...product]; //restOperator o spreadOperator
  } else {
    carProducts = [...carProducts, infoProduct];
  }
  carElementsHTML();
}

//Reenderiza los productos dentro del carrito

function carElementsHTML() {
  //! como cada vez que iteramos con forEach creamos un nuevo div, debemos depurar los duplicados reinicializando el carList con innerHTML vacío. Esto borra todo lo que pueda ser repetido.
  carList.innerHTML = "";
  // Un forEach es un un for simplificado, hace una iteracion por cada elemento y retorna un resultado
  carProducts.forEach((product) => {
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="car__product">
            <div class="car__product__image">
                <img src="${product.image}" alt="">
            </div>
            <div class="car__product__description">
                <div>
                    <p>${product.name}</p>
                </div>
                <div>
                    <p>Precio: ${product.price}</p>
                </div>
                <div>
                    <p>Cantidad: ${product.quantity}</p>
                </div>
                <div class="car__product__button">
                    <button class="delete__product" data-id="${product.id}">Delete</button>
                </div>
            </div>
        </div>
        <hr>
        `;
    carList.appendChild(div); //Agrega un hijo dentro del div
  });
  // LocalStorge
  productsStorage();
}
// LocalStorage almacena en texto plano cualquier tipo de información de tamaño limitado, clave valor,
function productsStorage() {
  localStorage.setItem("car", JSON.stringify(carProducts));
}
// El target da la ubicación exacta donde se produjo el click
// Eliminar todos los productos
function emptyCar() {
  carProducts = [];
  carList.innerHTML = "";
  carElementsHTML();
}
//Eliminar producto individual
function removeProduct(e) {
  if (e.target.classList.contains("delete__product")) {
    const productId = e.target.getAttribute("data-id");
    carProducts = carProducts.filter((product) => product.id !== productId);
    carElementsHTML(); //Para volver a poner en el carrito los elementos
  }
}
