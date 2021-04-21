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
  // busca os resultados de uma Promise de consulta usando a api do mercado livre e um termo recebido como parâmetro
  const response = await fetch(url);

  // retorna o objeto JSON resultado do sucesso de uma Promise do processamento da stream response
  return response.json();
};

/*
  Essa função retorna uma lista dos itens relacionados com uma consulta que contém o termo (palavra) passado como parâmetro.

  Créditos pela explicação sobre async/await e .then():
  @Henrique Clementino - Turma 10 - Tribo B 
  @Janaina Oliveira - Turma 10 - Tribo B 
  @Luanderson Santos 
*/
const createProductsList = async (query = 'computador') => {
  // busca os resultados de uma Promise de consulta usando a api do mercado livre e um termo recebido como parâmetro e desestrutura o objeto JSON retornado
  const { results } = await fetchAPI(
    `https://api.mercadolibre.com/sites/MLB/search?q=${query}`,
  );

  return results; // retorna uma lista de produtos
  //  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  //  const { results } = await response.json();
  //  console.log(results);
};

/*
  Essa função recebe uma lista de produtos e renderiza seus elementos.

  Créditos pela explicação sobre destructuring:
  @Henrique Clementino - Turma 10 - Tribo B
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
  Essa função recebe um evento "click" disparado por um cartItem e o remove do carrinho
 */
function cartItemClickListener(event) {
  const li = event.target; // armazena o elemento li que disparou o evento
  const ol = li.parentElement; // obtem o elemento ol deste li
  ol.removeChild(li); // e remove o filho li de ol
}

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

  Versão substituída por getSkuFromProductItem

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
 */
const itemAddButtonClickListener = async (event) => {
  const button = event.target; // armazena o elemento button que disparou o evento

  const item = button.parentElement; // obtem o section item deste button

  const itemID = getSkuFromProductItem(item); // busca o itemSku deste item

  // busca o itemSku que possui o button que disparou o evento e armazena em itemID
  // const itemID = searchItemSkuByClickedButton(button).innerText;
  // busca o resultado de uma Promise de consulta usando a api do mercado livre e o id do item que disparou o evento e  // armazena os detalhes deste item
  const itemDetails = await fetchAPI(
    `https://api.mercadolibre.com/items/${itemID}`,
  );

  const cartItem = createCartItemElement(itemDetails); // cria um elemento HTML cartItem com itemDetails

  renderCartItemElement(cartItem); // e o adiciona como filho no elemento ol que possui a classe 'cart__items'
};

/*
   Essa função executa a configuração relacionada aos eventos, como por exemplo, escutadores de eventos.
  */
const setupEvents = () => {
  // obtém os elementos button que possuem a classe 'item__add' e armazena em itemAddButtonList
  const itemAddButtonList = document.querySelectorAll('.item__add');

  // adiciona um escutador de evento "click" que dispara a function itemAddButtonClickListener para cada elemento button em itemAddButtonList
  itemAddButtonList.forEach((button) =>
    button.addEventListener('click', itemAddButtonClickListener));
};

window.onload = async function onload() {
  // cria e renderiza a lista de produtos relacionados com uma consulta que contém o termo (palavra) passado como parâmetro
  renderProductsList(await createProductsList());

  setupEvents(); // realiza setup relacionado a eventos
};
