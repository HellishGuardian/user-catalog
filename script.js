const userList = document.getElementById('user-list');
const searchInput = document.getElementById('search');
let users = [];

function createUserCard(user) {
  const card = document.createElement('div');
  card.className = 'user-card';
  card.innerHTML = `
    <img src="${user.picture.large}" alt="Фото" />
    <h3>${user.name.first} ${user.name.last}</h3>
    <p>${user.email}</p>
    <button class="toggle-btn">▼</button>
    <div class="user-extra hidden">
      <p><strong>Телефон:</strong> ${user.phone}</p>
      <p><strong>Місто:</strong> ${user.location.city}</p>
      <p><strong>Вік:</strong> ${user.dob.age}</p>
    </div>
  `;

  const toggleBtn = card.querySelector('.toggle-btn');
  const extraBlock = card.querySelector('.user-extra');

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    document.querySelectorAll('.user-extra').forEach(el => {
      if (el !== extraBlock) {
        el.classList.add('hidden');
        el.previousElementSibling?.classList?.remove('open');
      }
    });

    extraBlock.classList.toggle('hidden');
    toggleBtn.classList.toggle('open');
    toggleBtn.textContent = extraBlock.classList.contains('hidden') ? '▼' : '▲';
  });

  return card;
}

function renderUsers(data) {
  if (!userList) return;
  userList.innerHTML = '';
  data.forEach(user => {
    userList.appendChild(createUserCard(user));
  });
}

function applySearch() {
  if (!searchInput) return;
  const value = searchInput.value.toLowerCase();
  const filtered = users.filter(u =>
    u.name.first.toLowerCase().includes(value) || u.name.last.toLowerCase().includes(value)
  );
  renderUsers(filtered);
}

if (searchInput) {
  searchInput.addEventListener('input', applySearch);

  fetch("https://randomuser.me/api/?results=10")
    .then(res => res.json())
    .then(data => {
      users = data.results;
      renderUsers(users);
    });
}

// Вставка header и footer
function includeHTML(selector, file) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.querySelector(selector).innerHTML = html;
      if (file.includes('footer')) {
        const yearSpan = document.getElementById('year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
      }
    });
}

document.addEventListener("DOMContentLoaded", () => {
  includeHTML("header", "header.html");
  includeHTML("footer", "footer.html");
});
