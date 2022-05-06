const $container = document.querySelector('.container');
const $next = document.querySelector('.next');
const $prev = document.querySelector('.prev');
const $currentPage = document.querySelector('.currentPage');
const $allPages = document.querySelector('.allPages');

const $pageInput = document.querySelector('.pageInput');
const $inputButton = document.querySelector('.inputButton');

const $searchInput = document.querySelector('.searchInput');

const baseUrl = 'https://pokeapi.co/api/v2/'
const limit = 20;
const all_pokemons = 1126;
const all_pages = Math.floor(all_pokemons / limit)
let offSetCounter = 0;
let currentPage = 1

let selectPage = 1


window.addEventListener('load', () => {
  getData(`${baseUrl}pokemon`, `limit=${limit}&${offSetCounter}`, cb => {
    cardTemplate(cb.results);
  })
})

function getData(url, query, cb){
  fetch(`${url}?${query}`)
  .then(res => res.json())
  .then(r => cb(r))
}


function cardTemplate(base){
  const markup = base.map((item) => `
    <div class="card" onclick="getSingleData('${item.url}')">
      <div class="card-header">
        <h3>${item.name}</h3>
      </div>
    </div>
  `).join('')
  $container.innerHTML = markup
}

function getSingleData(url){
  getData(url, '', cb => {
    console.log(cb);
    $container.innerHTML = `
      <div class="single">
        <div class="singleWrapper">
          <div class="header">
            <div class="single-header">
              <h1>${cb.name}</h1>
              <img src="${cb.sprites.other.dream_world.front_default}">
            </div>
            <ul class="list">
                <li>Type: <span>${cb.types[0].type.name}</span></li>
                <li>Height: <span>${cb.height}m</span></li>
                <li>Weight: <span>${cb.weight}kg</span></li>
              </ul>
          </div>
          <div class="stats">
            <div class="stat">
              <h3>${cb.stats[0].stat.name}:</h4>
              <div class="statBlock">
                <div style="width:${cb.stats[0].base_stat}%;"></div>
                <span>${cb.stats[0].base_stat}</span>
              </div>
            </div>
            <div class="stat">
              <h3>${cb.stats[1].stat.name}:</h3>
              <div class="statBlock">
                <div style="width:${cb.stats[1].base_stat}%;"></div>
                <span>${cb.stats[1].base_stat}</span>
              </div>
            </div>
            <div class="stat">
              <h3>${cb.stats[2].stat.name}:</h3>
              <div class="statBlock">
                <div style="width:${cb.stats[2].base_stat}%;"></div>
                <span>${cb.stats[2].base_stat}</span>
              </div>
            </div>
            <div class="stat">
              <h3>${cb.stats[3].stat.name}:</h3>
              <div class="statBlock">
                <div style="width:${cb.stats[4].base_stat}%;"></div>
                <span>${cb.stats[4].base_stat}</span>
              </div>
            </div>
            <div class="stat">
              <h3>${cb.stats[4].stat.name}:</h3>
              <div class="statBlock">
                <div style="width:${cb.stats[5].base_stat}%;"></div>
                <span>${cb.stats[5].base_stat}</span>
              </div>
            </div>
          </div>
          <button onclick="goBack()">Go back</button>
        </div>
      </div>
    `
  })
}


function goBack(){
  window.location.reload()
}

window.addEventListener('load', () => {
  $allPages.innerHTML = all_pages
  $currentPage.innerHTML = currentPage
  $prev.setAttribute('disabled', true)
})

$next.addEventListener('click', e => {
  e.preventDefault()
  
  offSetCounter += limit
  currentPage++

  if(currentPage === all_pages){
    $next.setAttribute('disabled', true)
  }

  changePage()

  $prev.removeAttribute('disabled')

  getData(`${baseUrl}pokemon`, `limit=${limit}&offset=${offSetCounter}`, cb => {
    cardTemplate(cb.results)
  })
})

$prev.addEventListener('click', e => {
  e.preventDefault()
  offSetCounter -= limit
  currentPage--

  if (currentPage === 1){
    $prev.setAttribute('disabled', true)
  }

  changePage()

  $next.removeAttribute('disabled')
  getData(`${baseUrl}pokemon`, `limit=${limit}&offset=${offSetCounter}`, cb => {
    cardTemplate(cb.results)
  })
})

function changePage(){
  $currentPage.innerHTML = currentPage
}

$pageInput.addEventListener('change', e => {
  selectPage = e.target.value
})

$inputButton.addEventListener('click', e => {
  e.preventDefault();
  if (selectPage.trim() > all_pages || selectPage.trim() < 1 || selectPage.trim() === currentPage){
    alert('Введите корректную страницу!');

    $pageInput.value = ''
  }else {

    const selectedOffset = selectPage.trim() * limit - limit

    offSetCounter = selectedOffset

    currentPage = selectPage.trim()

    $currentPage.innerHTML = selectPage.trim()

    if (selectPage.trim() != 1){
      $prev.removeAttribute('disabled')
    } else {
      $prev.setAttribute('disabled', true)
    }

    if (selectPage.trim() !== all_pages){
      $next.removeAttribute('disabled')
    } else {
      $next.setAttribute('disables', true)
    }

    $pageInput.value = ''

    getData(`${baseUrl}pokemon`, `limit=${limit}&offset=${selectedOffset}`, cb => {
      cardTemplate(cb.results)
    })
  }
  
})

$searchInput.addEventListener('change', e => {
  let val = e.target.value
  getData(`${baseUrl}pokemon`, `limit=100000&offset=${offSetCounter}`, cb => {
    const filtered = cb.results.filter(item => item.name.includes(val))
    if(val === filtered[0].name){
      cardTemplate(filtered)
    }else{
      alert('Not found')
    }
  })
})