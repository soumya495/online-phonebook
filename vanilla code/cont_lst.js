const search = () => {
  const searchbox = document.getElementById('search-item').value.toUpperCase()
  const contactlist = document.getElementById('contact-list')
  const contacts = document.querySelectorAll('.contact')
  const names = document.getElementsByTagName('h4')

  for (var i = 0; i < names.length; i++) {
    let match = contacts[i].getElementsByTagName('h4')[0]

    if (match) {
      let textvalue = match.textContent || match.innerHTML
      if (textvalue.toUpperCase().indexOf(searchbox) > -1) {
        contacts[i].style.display = ''
      } else {
        contacts[i].style.display = 'none'
      }
    }
  }
}
