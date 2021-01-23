import jquery from 'jquery';
import axios from 'axios'

class Search {
  constructor() {
    this.addSearchHTML()

    this.openButton = document.querySelectorAll('.js-search-trigger')
    this.closeButton = document.querySelector('.search-overlay__close')
    this.searchOverlay = document.querySelector('.search-overlay')
    this.searchField = document.getElementById('search-term')
    this.resultDiv = document.getElementById('search-overlay__results')

    // this.openButton = jquery('.js-search-trigger')
    // this.closeButton = jquery('.search-overlay__close')
    // this.searchOverlay = jquery('.search-overlay')
    // this.searchField = jquery('#search-term')
    // this.resultDiv = jquery('#search-overlay__results')

    this.isOverlayOpen = false
    this.isSpinnerVisible = false
    this.typingTimer
    this.events()
  }

  events() {
    this.openButton.forEach(el => {
      el.addEventListener('click', event => {
        event.preventDefault()
        this.openOverlay()
      })
    })
    this.closeButton.addEventListener('click', () => this.closeOverlay())
    document.addEventListener('keydown', (event) => this.keyPressDispatcher(event))
    this.searchField.addEventListener('input', () => this.typingLogic())

    // this.openButton.on('click', this.openOverlay.bind(this))
    // this.closeButton.on('click', this.closeOverlay.bind(this))
    // jquery(document).on('keydown', this.keyPressDispatcher.bind(this))
    // this.searchField.on('input', this.typingLogic.bind(this))
  }

  typingLogic() {
    clearTimeout(this.typingTimer);
    // if (this.searchField.val()) {
    if (this.searchField.value) {
      if (!this.isSpinnerVisible) {
        // this.resultDiv.html('<div class="spinner-loader"></div>')
        this.resultDiv.innerHTML = '<div class="spinner-loader"></div>'
        this.isSpinnerVisible = true
      }
      this.typingTimer = setTimeout(() => this.getResults(), 750)
    } else {
      // this.resultDiv.html('')
      this.resultDiv.innerHTML = ''
      this.isSpinnerVisible = false
    }
  }
  
  openOverlay() {
    this.searchOverlay.classList.add('search-overlay--active')
    // this.searchOverlay.addClass('search-overlay--active')
    document.querySelector('body').classList.add('body-no-scroll')
    // jquery('body').addClass('body-no-scroll')
    // this.searchField.val('');
    this.searchField.value = '';
    setTimeout(() => {
      this.searchField.focus();
    }, 301)
    this.isOverlayOpen = true
  }
  
  closeOverlay() {
    this.searchOverlay.classList.remove('search-overlay--active')
    // this.searchOverlay.removeClass('search-overlay--active')
    document.querySelector('body').classList.remove('body-no-scroll')
    // jquery('body').removeClass('body-no-scroll')
    this.isOverlayOpen = false
  }

  keyPressDispatcher(event) {
    // if (event.keyCode == 83 && !this.isOverlayOpen && !jquery('input, textarea').is(':focus')) {
    if (event.keyCode == 83 && !this.isOverlayOpen && !document.querySelector('input, textarea').hasFocus()) {
      this.openOverlay()
    } else if (event.keyCode == 27 && this.isOverlayOpen) {
      this.closeOverlay()
    }
  }

  // getResults() {
  async getResults() {
    // jquery.getJSON(`${universityData.root_url}/wp-json/university/v1/search?term=${this.searchField.val()}`, results => {
      const response = await axios.get(`${universityData.root_url}/wp-json/university/v1/search?term=${this.searchField.value}`)
      const results = response.data

      let generalInfo, professors, programs, events, campuses
      if (results.generalInfo.length > 0) {
        generalInfo = `
          <h2 class='search-overlay__section-title'>General Information:</h2>
          <ul class='link-list min-list'>
            ${results.generalInfo.map(res => `<li><a href='${res.permalink}'>${res.title}</a> ${res.type == 'post' ? `by ${res.authorName}` : ''}</li>`).join('')}
          </ul>
        `
      } else {
        generalInfo = `<h2 class='search-overlay__section-title'>No General Information Found</h2>`
      }
      if (results.professors.length > 0) {
        professors = `
          <h2 class='search-overlay__section-title'>Professors:</h2>
          <ul class='professor-cards'>
            ${results.professors.map(res => `
              <li class="professor-card__list-item">
                <a class="professor-card" href="${res.permalink}">
                  <img src="${res.image}" class="professor-card__image">
                  <span class="professor-card__name">${res.title}</span>
                </a>
              </li>
            `).join('')}
          </ul>
        `
      } else {
        professors = `<h2 class='search-overlay__section-title'>No Professors Found</h2>`
      }
      if (results.programs.length > 0) {
        programs = `
          <h2 class='search-overlay__section-title'>Programs:</h2>
          <ul class='link-list min-list'>
            ${results.programs.map(res => `<li><a href='${res.permalink}'>${res.title}</a></li>`).join('')}
          </ul>
        `
      } else {
        programs = `<h2 class='search-overlay__section-title'>No Programs Found</h2>`
      }
      if (results.events.length > 0) {
        events = `
          <h2 class='search-overlay__section-title'>Events:</h2>
          ${results.events.map(res => `
            <div class="event-summary">
              <a class="event-summary__date t-center" href="${res.permalink}">
                <span class="event-summary__month">${res.month}</span>
                <span class="event-summary__day">${res.day}</span>
              </a>
              <div class="event-summary__content">
                <h5 class="event-summary__title headline headline--tiny"><a href="${res.permalink}">${res.title}</a></h5>
                <p>${res.excerpt} <a href="${res.permalink}" class="nu gray">. Learn more</a></p>
              </div>
            </div> 
          `).join('')}
        `
      } else {
        events = `<h2 class='search-overlay__section-title'>No Events Found</h2>`
      }
      if (results.campuses.length > 0) {
        campuses = `
          <h2 class='search-overlay__section-title'>Campuses:</h2>
          <ul class='link-list min-list'>
            ${results.campuses.map(res => `<li><a href='${res.permalink}'>${res.title}</a> ${res.type == 'post' ? `by ${res.authorName}` : ''}</li>`).join('')}
          </ul>
        `
      } else {
        campuses = `<h2 class='search-overlay__section-title'>No Campuses Found</h2>`
      }
      // this.resultDiv.html(`
      this.resultDiv.innerHTML = `
        <div class="row">
          <div class="one-third">
            ${generalInfo}
          </div>
          <div class="one-third">
            ${professors}
            ${programs}
          </div>
          <div class="one-third">
            ${events}
            ${campuses}
          </div>
        </div>
      `
      // `)
      this.isSpinnerVisible = false
    // })

    // jquery.when(
    //   jquery.getJSON(`${universityData.root_url}/wp-json/wp/v2/posts?search=${this.searchField.val()}`),
    //   jquery.getJSON(`${universityData.root_url}/wp-json/wp/v2/pages?search=${this.searchField.val()}`)
    // ).then((posts, pages) => {
    //   const results = [...posts[0], ...pages[0]]
    //   if (results.length > 0) {
    //     this.resultDiv.html(`
    //       <h2 class='search-overlay__section-title'>Results:</h2>
    //       <ul class='link-list min-list'>
    //       ${results.map(res => `<li><a href='${res.link}'>${res.title.rendered}</a> ${res.type == 'post' ? `by ${res.authorName}` : ''}</li>`).join('')}
    //       </ul>
    //     `)
    //   } else {
    //     this.resultDiv.html(`
    //       <h2 class='search-overlay__section-title'>Nothing Found</h2>
    //     `)
    //   }
    //   this.isSpinnerVisible = false
    // }, () => {
    //   this.resultDiv.html('<p>an error occured!</p>')
    // })

    // jquery.getJSON(`./wp-json/wp/v2/posts?search=${this.searchField.val()}`, posts => {
    // jquery.getJSON(`${universityData.root_url}/wp-json/wp/v2/posts?search=${this.searchField.val()}`, posts => {
    //   jquery.getJSON(`${universityData.root_url}/wp-json/wp/v2/pages?search=${this.searchField.val()}`, pages => {
    //     const results = [...posts, ...pages]
    //     if (results.length > 0) {
    //       this.resultDiv.html(`
    //         <h2 class='search-overlay__section-title'>Results:</h2>
    //         <ul class='link-list min-list'>
    //         ${results.map(res => `<li><a href='${res.link}'>${res.title.rendered}</a></li>`).join('')}
    //         </ul>
    //       `)
    //     } else {
    //       this.resultDiv.html(`
    //         <h2 class='search-overlay__section-title'>Nothing Found</h2>
    //       `)
    //     }
    //     this.isSpinnerVisible = false
    //   })
    // })
  }

  addSearchHTML() {
    // jquery('body').append(`
    document.querySelector('body').insertAdjacentHTML('beforeend', `
      <div class="search-overlay">
        <div class="search-overlay__top">
          <div class="container">
            <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
            <input type="text" class="search-term" placeholder="what are your looking for?" id="search-term" autocomplete="off">
            <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
          </div>
        </div>

        <div class="container">
          <div id="search-overlay__results">

          </div>
        </div>
      </div>
    `)
  }

}

export default Search;
