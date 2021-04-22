/*
  Essa função recebe uma imageSource, constrói e retorna este respectivo elemento HTML com a classe "item__image".
*/
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
/*
  Essa função recebe um element, className e innerText, constrói e retorna este respectivo elemento HTML com estas informações.
*/
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
/*
  Essa função desestrutura um objeto produto recebido, construindo e retornando os componentes HTML referentes a este parâmetro.
*/
// function createProductItemElement({ sku, name, image }) {
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  return section;
}
/*
  Essa função recebe uma url, consulta na API e retorna o objeto JSON resultado do sucesso de uma Promise do processamento da stream response
*/
const fetchAPI = async (url) => {
  const response = await fetch(url); // busca os resultados de uma Promise de consulta usando a api do mercado livre e um termo recebido como parâmetro
  return response.json(); // retorna o objeto JSON resultado do sucesso de uma Promise do processamento da stream response
};
/*
  Essa função retorna uma lista dos itens relacionados com uma consulta que contém o termo (palavra) passado como parâmetro.
  Créditos pela explicação sobre async/await e .then(): @Henrique Clementino - Turma 10 - Tribo B ; @Janaina Oliveira - Turma 10 - Tribo B e @Luanderson Santos 
*/
const createProductsList = async (query = 'computador') => {
  // busca os resultados de uma Promise de consulta usando a api do mercado livre e um termo recebido como parâmetro e desestrutura o objeto JSON retornado
  const { results } = await fetchAPI(
    `https://api.mercadolibre.com/sites/MLB/search?q=${query}`,
  );
  return results; // retorna uma lista de produtos
};
/*
  Essa função recebe uma lista de produtos e renderiza seus elementos.
  Créditos pela explicação sobre destructuring: @Henrique Clementino - Turma 10 - Tribo B
*/
const renderProductsList = (productsList) => {
  const items = document.querySelector('.items'); // obtém o elemento que possui a classe 'items'
  productsList.forEach((product) => {
    // para cada produto na lista
    // const { id, title, thumbnail } = product;
    // const productCart = createProductItemElement({ sku: id, name: title, image: thumbnail });
    const productCart = createProductItemElement(product); // cria um elemento HTML que o armazena
    items.appendChild(productCart); // e o adiciona como filho de 'items'
  });
};
/*
  Essa função recebe um elemento item e retorna seu identificador sku
*/
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
/*
  Essa função recebe o "sku" de um cartItem e o remove de localStorage
  Versão 2 que resolve Requisito 4
 */
const removeCartItemInLocalStorage = (sku) => localStorage.removeItem(sku); // remove o cartItem de localStorage
/*
  Essa função desestrutura um objeto cartItem recebido e o remove de localStorage
  Versão 1 que resolve Requisito 4
 */
/* const removeCartItemInLocalStorage = ({ id: sku }) => {
  localStorage.removeItem(sku); // remove o cartItem de localStorage
}; */
/*
    Essa função recebe um cartItem (formato texto) e retorna o objeto item que o originou
    Versão 1 que resolve Requisito 4
   */
const cartItemTextToItemObject = (cartItemText) => {
  const cartItemEntries = cartItemText
    .replace('$', '') // retira o $ que acompanha o preço
    .replace('SKU', 'id') // substitui 'SKU' por 'id'
    .replace('NAME', 'title') // substitui 'NAME' por 'title'
    .replace('PRICE', 'price') // substitui 'PRICE' por 'price'
    .split(' | ') // divide o texto em lista onde cada posição é uma entrada de cartItem no formato texto
    .map(
      // cria uma lista onde cada posição é
      (phrase) => phrase.split(': '), // a divisão de cada phrase em lista sendo posição 0 a key e posição 1 o value
    );
  return Object.fromEntries(cartItemEntries); // retorna um objeto item a partir das entradas em cartItemEntries
};
/*
   Essa função recebe um cartItem (formato texto), divide o texto em substrings usando o delimitador ' ' e retorna sku dele
   Versão 2 que resolve Requisito 4
  */
/* const getSkuFromCartItemText = (cartItemText) => cartItemText.split(' ')[1]; // divide o texto em substrings usando o delimitador ' ' e retorna a posição da sku dele */
/*
  Essa função desestrutura um objeto itemDetails recebido e atualiza o preço total dos itens do carrinho
*/
const updateTotalPriceByCart = ({ price: cartItemPrice }) => {
  const cartTotalPrice = document.querySelector('.total-price'); // obtem o elemento HTML que contém o preço total corrente
  let totalPrice = parseFloat(cartTotalPrice.innerText); // e obtem o preço total, converte para float e armazena em totalPrice
  totalPrice += cartItemPrice; // atualiza o preço total no carrinho
  cartTotalPrice.innerText = totalPrice; // atualiza o preço total na página HTML
};
/*
  Essa função recebe um evento "click" disparado por um cartItem e o remove do carrinho

  /// Versão 1 que resolve Requisito 4 ///
  const item = cartItemTextToItemObject(cartItemText); // constrói o objeto item que originou cartItem
  removeCartItemInLocalStorage(item); // remove o cartItem de localStorage

  /// Versão 2 que resolve Requisito 4 ///
  const cartItemSku = getSkuFromCartItemText(cartItemText); // obtem o sku de cartItem
  removeCartItemInLocalStorage(cartItemSku); // remove o cartItem de localStorage
 */
function cartItemClickListener(event) {
  const li = event.target; // armazena o elemento li que disparou o evento
  const ol = li.parentElement; // obtem o elemento ol deste li
  const cartItemText = li.innerText; // obtem o texto de cartItem
  /// Versão 3 que resolve Requisitos 4 e 5 ///
  const item = cartItemTextToItemObject(cartItemText); // constrói o objeto item que originou cartItem
  const { id, title, price } = item;
  removeCartItemInLocalStorage(id); // remove o cartItem de localStorage

  updateTotalPriceByCart({ id, title, price: price * -1 }); // atualiza o preço total no carrinho, considerando o preço negativo do item uma vez que será retirado do carrinho
  ol.removeChild(li); // e remove o filho li de ol
}
/*
  Essa função desestrutura um objeto cartItem recebido e insere em localStorage
 */
const addCartItemInLocalStorage = ({ id, title, price }) => {
  localStorage.setItem(id, JSON.stringify({ title, price }));
};
/*
  Essa função desestrutura um objeto item detalhado, cria um elemento HTML li contendo sku, name e salePrice, adiciona um escutador de eventos "click" e o retorna
 */
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
/*
  Função criada para retornar o item que possui o button clicado

  /// Versão 1 que resolve Requisito 2 e que foi substituída por getSkuFromProductItem
const searchItemSkuByClickedButton = (button) => {
  let nodeItem = button.previousElementSibling; // armazena o node pertencente ao item e que é anterior ao button que disparou ao evento
  while (nodeItem.className !== 'item__sku') { // enquanto o nome da classe de node for diferente de 'item__sku'
    nodeItem = nodeItem.previousElementSibling; // avance para o node anterior
  }
  return nodeItem; // retorna o node que possui a classe 'item_sku'
};
*/
/*
  Essa função recebe um cartItem, o elemento ol que possui a classe 'cart__items' e o adiciona como filho
 */
const renderCartItemElement = (cartItem) => {
  const ol = document.querySelector('.cart__items'); // obtem o elemento ol que possui a classe 'cart__items'
  ol.appendChild(cartItem); // e adiciona o elemento HTML cartItem com seu filho
};
/*
  Essa função recebe um evento "click" disparado por um button de um item, obtém item e constrói um elemento HTML cartItem com itemDetails usando a API e o adiciona como filho no elemento ol que possui a classe "cart__items"

  /// Versão 1 que resolve Requisito 2 ///
  busca o itemSku que possui o button que disparou o evento e armazena em itemID
  const itemID = searchItemSkuByClickedButton(button).innerText;
 */
const itemAddButtonClickListener = async (event) => {
  const button = event.target; // armazena o elemento button que disparou o evento
  const item = button.parentElement; // obtem o section item deste button
  /// Versão 2 que resolve Requisito 2 ///
  const itemID = getSkuFromProductItem(item); // busca o itemSku deste item

  const itemDetails = await fetchAPI(
    `https://api.mercadolibre.com/items/${itemID}`,
  ); // busca o resultado de uma Promise de consulta usando a api do mercado livre e o id do item que disparou o evento e armazena os detalhes deste item
  addCartItemInLocalStorage(itemDetails); // adiciona cartItem em localStorage
  const cartItem = createCartItemElement(itemDetails); // cria um elemento HTML cartItem com itemDetails
  updateTotalPriceByCart(itemDetails); // atualiza o preço total no carrinho
  renderCartItemElement(cartItem); // e o adiciona como filho no elemento ol que possui a classe 'cart__items'
};
/*
  Essa função carrega o carrinho de compras através do LocalStorage
 */
const loadCartItemsFromLocalStorage = () => {
  Object.keys(localStorage).forEach((id) => {
    const { title, price } = JSON.parse(localStorage.getItem(id)); // obtém, constrói e desestrutura o objeto que contém o título e o preço associado ao id do cartItem
    const cartItem = createCartItemElement({ id, title, price }); // cria um elemento HTML cartItem a partir do objeto itemDetails construído com dados de localStorage
    updateTotalPriceByCart({ id, title, price }); // atualiza o preço total no carrinho
    renderCartItemElement(cartItem); // e o adiciona como filho no elemento ol que possui a classe 'cart__items'
  });
};
/*
  Essa função recebe um evento "click" disparado por um button do carrinho, obtém cart e a partir dele os elementos ol, pai dos "cartItems", e "span.total-price", que armazena o preço total do carrinho. Então atualiza o preço total na página HTML com zero, apaga todos os cartItems de ol e salvos em localStorage.

  Material consultado sobre como remover todos os elementos filho de um nó:
    # Clearing textContent vs Looping to remove every lastChild vs Looping to remove every firstChild
    - https://stackoverflow.com/a/3955238
    - https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
    - https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    - https://stackoverflow.com/a/64800326
    # Emptying a node using the replaceChildren() API
      * 2020 Update - use the replaceChildren() API
        - https://stackoverflow.com/a/65413839
        - https://stackoverflow.com/a/64974905
      * Browser compatibility:
        - https://getdocs.org/Web/API/ParentNode/replaceChildren
        - https://caniuse.com/?search=replaceChildren
 */
const emptyCartButtonClickListener = (event) => {
  const button = event.target; // armazena o elemento button que disparou o evento
  const cart = button.parentElement; // obtem o section cart deste button
  const olCartItems = cart.querySelector('ol.cart__items'); // obtem o elemento ol que possui a classe 'cart__items'
  olCartItems.replaceChildren(); // apaga todos os cartItems de ol
  const cartTotalPrice = cart.querySelector('span.total-price'); // obtem o elemento span que armazena o preço total do carrinho
  cartTotalPrice.innerText = 0; // atualiza o preço total na página HTML
  localStorage.clear(); // apaga todos os cartItems salvos em localStorage
};
/*
   Essa função executa a configuração relacionada aos eventos, como por exemplo, escutadores de eventos.
  */
const setupEvents = () => {
  const itemAddButtonList = document.querySelectorAll('.item__add'); // obtém os elementos button que possuem a classe 'item__add' e armazena em itemAddButtonList
  itemAddButtonList.forEach((button) =>
    button.addEventListener('click', itemAddButtonClickListener)); // adiciona um escutador de evento "click" que dispara a function itemAddButtonClickListener para cada elemento button em itemAddButtonList
  const emptyCartButton = document.querySelector('.empty-cart'); // obtém o button que possui a classe 'empty-cart' e está em cart
  emptyCartButton.addEventListener('click', emptyCartButtonClickListener); // adiciona um escutador de evento "click" que dispara a function emptyCartButtonClickListener para o elemento button "emptyCartButton"
};
window.onload = async function onload() {
  // cria e renderiza a lista de produtos relacionados com uma consulta que contém o termo (palavra) passado como parâmetro
  renderProductsList(await createProductsList());
  loadCartItemsFromLocalStorage(); // carrega o carrinho de compras através do LocalStorage ao iniciar a página
  setupEvents(); // realiza setup relacionado a eventos
};
