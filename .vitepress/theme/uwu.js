/*
 * Follow: https://github.com/reactjs/react.dev/blob/main/src/pages/_document.tsx
 */

export function enableUwu() {

  try {
    var preferredUwu
    try {
      preferredUwu = localStorage.getItem('uwu')
    } catch (err) {}

    const isUwuValue =
      window.location && window.location.search && window.location.search.match(/uwu=(true|false)/)

    if (isUwuValue) {
      const isUwu = isUwuValue[1] === 'true'
      if (isUwu) {
        try {
          localStorage.setItem('uwu', true)
        } catch (err) {}
        document.documentElement.classList.add('uwu')
        console.log(
          'uwu mode enabled. logo credits to @sawaratsuki1004 via https://github.com/SAWARATSUKI/ServiceLogos'
        )
      } else {
        try {
          localStorage.removeItem('uwu', false)
        } catch (err) {}
      }
    } else if (preferredUwu) {
      document.documentElement.classList.add('uwu')
    }
  } catch (err) {}

  document.addEventListener('DOMContentLoaded', async () => {
    var logo
    while (!logo) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      logo = document.querySelector('img.logo')
    }
    if (document.documentElement.classList.contains('uwu')) {
      logo.src = '/images/uwu.png'
    }
  })
}
