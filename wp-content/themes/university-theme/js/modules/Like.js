import axios from 'axios'

class Like {
  constructor() {
    this.likeBox = document.querySelector('.like-box')
    this.events()
  }

  events() {
    this.likeBox.addEventListener('click', (event) => this.clickHandler(event))
  }

  clickHandler(event) {
    const currentLikeBox = event.target.closest('.like-box')
    if (currentLikeBox.dataset.exists == 'yes') {
      this.deleteLike(currentLikeBox)
    } else {
      this.createLike(currentLikeBox)
    }
  }

  async createLike(currentLikeBox) {
    try {
      const data = {
        professorId: currentLikeBox.dataset.professor
      }
      const res = await axios.post(`${universityData.root_url}/wp-json/university/v1/like`, data, {
        headers: {
          'X-WP-Nonce': universityData.nonce
        }
      })
      currentLikeBox.setAttribute('data-exists', 'yes')
      currentLikeBox.setAttribute('data-like', res.data)
      const likeCoundEl = currentLikeBox.querySelector('.like-count')
      const likeCount = parseInt(likeCoundEl.textContent)
      likeCoundEl.textContent =  `${likeCount + 1}`
    } catch(err) {
      console.log(err)
    }
  }

  async deleteLike(currentLikeBox) {
    try {
      const res = await axios({
        method: 'delete',
        url: `${universityData.root_url}/wp-json/university/v1/like`,
        data: {
          like: currentLikeBox.dataset.like
        },
        headers: {
          'X-WP-Nonce': universityData.nonce
        }
      })
      currentLikeBox.setAttribute('data-exists', 'no')
      currentLikeBox.setAttribute('data-like', '')
      const likeCoundEl = currentLikeBox.querySelector('.like-count')
      const likeCount = parseInt(likeCoundEl.textContent)
      likeCoundEl.textContent =  `${likeCount - 1}`
    } catch(err) {
      console.log(err)
    }
  }
}

export default Like;