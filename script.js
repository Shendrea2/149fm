// Script pentru funcționalitățile site-ului 149FM

document.addEventListener('DOMContentLoaded', function() {
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const audioPlayer = document.getElementById('audio-player');
  const trackInfo = document.getElementById('track-info');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterStatus = document.getElementById('newsletter-status');

  // Pentru program dinamic: vom încărca date din schedule.json și vom genera lista în HTML
  const scheduleList = document.getElementById('schedule-list');
  fetch('schedule.json')
    .then(response => response.ok ? response.json() : Promise.reject(new Error('File not found')))
    .then(data => {
      populateSchedule(data);
    })
    .catch(error => {
      console.error('Eroare la încărcarea programului:', error);
      // fallback program implicit dacă fișierul nu este accesibil
      const fallbackSchedule = [
        { time: '00:00–02:00', title: 'Nocturne alternative' },
        { time: '02:00–04:00', title: 'Synthwave vibes' },
        { time: '04:00–06:00', title: 'Chill & Ambient' },
        { time: '06:00–09:00', title: 'Morning Beats' },
        { time: '09:00–12:00', title: 'Podcast: Underground Talks' },
        { time: '12:00–15:00', title: 'Indie & Pop‑Rock' },
        { time: '15:00–18:00', title: 'Hip‑Hop & Soul' },
        { time: '18:00–20:00', title: 'Live Show: Urban Spotlight' },
        { time: '20:00–22:00', title: 'Electronic Journey' },
        { time: '22:00–00:00', title: 'Late Night Chill' }
      ];
      populateSchedule(fallbackSchedule);
    });

  // Funcție pentru popularea programului
  function populateSchedule(data) {
    scheduleList.innerHTML = '';
    data.forEach(item => {
      const li = document.createElement('li');
      const strong = document.createElement('strong');
      strong.textContent = item.time;
      li.appendChild(strong);
      li.appendChild(document.createTextNode(' – ' + item.title));
      scheduleList.appendChild(li);
    });
  }

  // Schimbarea temei între întunecată și luminoasă
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light');
    const currentTheme = body.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
  });

  // Aplică tema salvată în localStorage
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'light') {
    body.classList.add('light');
  }

  // Actualizează textul „now playing” în funcție de starea audio
  // Simulare dinamică „Now Playing”
  // Dacă serverul tău oferă metadate, poți înlocui această listă cu apeluri reale
  const playlist = [
    { title: 'Trupa Subterană – Piesa 1', duration: 180 },
    { title: 'DJ Radu – Remix 2025', duration: 220 },
    { title: 'Ana feat. MC – Urban Beat', duration: 200 },
    { title: 'Unknown Artist – Chill Vibes', duration: 240 }
  ];
  let currentTrackIndex = 0;
  let nowPlayingInterval;

  function startNowPlayingSimulation() {
    // Setează textul inițial
    trackInfo.textContent = playlist[currentTrackIndex].title;
    // Curăță orice interval anterior
    clearInterval(nowPlayingInterval);
    nowPlayingInterval = setInterval(() => {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      trackInfo.textContent = playlist[currentTrackIndex].title;
    }, playlist[currentTrackIndex].duration * 1000);
  }

  function stopNowPlayingSimulation() {
    clearInterval(nowPlayingInterval);
    trackInfo.textContent = 'În pauză';
  }

  // Actualizează textul în funcție de evenimentele audio
  audioPlayer.addEventListener('play', () => {
    startNowPlayingSimulation();
  });

  audioPlayer.addEventListener('pause', () => {
    stopNowPlayingSimulation();
  });

  audioPlayer.addEventListener('waiting', () => {
    trackInfo.textContent = 'Se încarcă...';
  });

  // Trimiterea formularului de contact la un serviciu extern (ex: Formspree)
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    formStatus.textContent = 'Se trimite...';
    const data = new FormData(contactForm);

    // Înlocuiește „your-form-id” cu ID-ul furnizat de serviciul tău de formulare (de ex. Formspree)
    fetch('https://formspree.io/f/your-form-id', {
      method: 'POST',
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    }).then(function(response) {
      if (response.ok) {
        formStatus.textContent = 'Mulțumim! Mesajul a fost trimis.';
        contactForm.reset();
      } else {
        response.json().then(function(data) {
          if (Object.hasOwn(data, 'errors')) {
            formStatus.textContent = data['errors'].map(error => error['message']).join(', ');
          } else {
            formStatus.textContent = 'Eroare la trimitere. Încearcă din nou.';
          }
        });
      }
    }).catch(function() {
      formStatus.textContent = 'Eroare la trimitere. Încearcă din nou.';
    });
  });

  // Trimiterea formularului de newsletter
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(event) {
      event.preventDefault();
      newsletterStatus.textContent = 'Se trimite...';
      const data = new FormData(newsletterForm);
      fetch('https://formspree.io/f/your-newsletter-id', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      }).then(function(response) {
        if (response.ok) {
          newsletterStatus.textContent = 'Mulțumim pentru abonare! Verifică emailul pentru confirmare.';
          newsletterForm.reset();
        } else {
          response.json().then(function(data) {
            if (Object.hasOwn(data, 'errors')) {
              newsletterStatus.textContent = data['errors'].map(error => error['message']).join(', ');
            } else {
              newsletterStatus.textContent = 'Eroare la abonare. Încearcă din nou.';
            }
          });
        }
      }).catch(function() {
        newsletterStatus.textContent = 'Eroare la abonare. Încearcă din nou.';
      });
    });
  }
});
