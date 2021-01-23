import axios from 'axios'

class MyNotes {
  constructor() {
    if (document.getElementById('my-notes')) {
      this.events()
    }
  }

  events() {
    const notesUL = document.getElementById('my-notes')
    notesUL.addEventListener('click', (event) => {
      if (event.target.className.includes('delete-note')) {
        this.deleteNote(event)
      } else if (event.target.className.includes('edit-note')) {
        this.editNote(event)
      } else if (event.target.className.includes('update-note')) {
        this.updateNote(event)
      }
    })
    
    document.querySelector('.submit-note').addEventListener('click', this.createNote)
  }

  async deleteNote(event) {
    const note = event.target.closest('[data-id]')
    try {
      const res = await axios.delete(`${universityData.root_url}/wp-json/wp/v2/note/${note.dataset.id}`, {
        headers: {
          'X-WP-Nonce': universityData.nonce
        }
      })
      note.parentNode.removeChild(note)
      if (res.data.noteCount < 5) {
        document.querySelector('.note-limit-message').classList.remove('active')
      }
    } catch(err) {
      console.log(err)
    }
  }

  async updateNote(event) {
    const note = event.target.closest('[data-id]')
    const ourUpdatedPost = {
      'title': note.querySelector('.note-title-field').value,
      'content': note.querySelector('.note-body-field').value
    }
    try {
      await axios.post(`${universityData.root_url}/wp-json/wp/v2/note/${note.dataset.id}`, ourUpdatedPost, {
        headers: {
          'X-WP-Nonce': universityData.nonce
        }
      })
      this.makeNoteReadOnly(note)
    } catch(err) {
      console.log(err)
    }
  }

  async createNote() {
    const titleEl = document.querySelector('.new-note-title')
    const contentEl = document.querySelector('.new-note-body')
    const ourNewPost = {
      'title': titleEl.value,
      'content': contentEl.value,
      'status': 'publish',
      // 'status': 'private'
    }
    try {
      const res = await axios.post(`${universityData.root_url}/wp-json/wp/v2/note`, ourNewPost, {
        headers: {
          'X-WP-Nonce': universityData.nonce
        }
      })
      titleEl.value = ''
      contentEl.value = ''
      if (res.data == 'You have reached your note limit') {
        document.querySelector('.note-limit-message').classList.add('active')
      } else {
        document.getElementById('my-notes').insertAdjacentHTML('afterbegin', `
          <li data-id="${res.data.id}">
            <input readonly class="note-title-field" type="text" name="title" value="${res.data.title.raw}">
            <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
            <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
            <textarea readonly class="note-body-field" name="content">${res.data.content.raw}</textarea>
            <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
          </li>
        `)
      }
    } catch(err) {
      console.log(err)
    }
  }

  editNote(event) {
    const note = event.target.closest('[data-id]')
    if (note.dataset.state == 'editable') {
      this.makeNoteReadOnly(note)
    } else {
      this.makeNoteEditable(note)
    }
  }

  makeNoteEditable(note) {
    const inputs = note.querySelectorAll('.note-title-field, .note-body-field')
    inputs.forEach(el => {
      el.removeAttribute('readonly')
      el.classList.add('note-active-field')
    })
    note.querySelector('.update-note').classList.add('update-note--visible')
    note.querySelector('.edit-note').innerHTML = `<i class="fa fa-times" aria-hidden="true"></i> Cancel`
    note.dataset.state = 'editable'
  }
  
  makeNoteReadOnly(note) {
    const inputs = note.querySelectorAll('.note-title-field, .note-body-field')
    inputs.forEach(el => {
      el.setAttribute('readonly', true)
      el.classList.remove('note-active-field')
    })
    note.querySelector('.update-note').classList.remove('update-note--visible')
    note.querySelector('.edit-note').innerHTML = `<i class="fa fa-pencil" aria-hidden="true"></i> Edit`
    note.dataset.state = 'readonly'
  }
}

export default MyNotes;