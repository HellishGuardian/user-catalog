const userList = document.getElementById('user-list');
const modal = document.getElementById('modal');
const modalContent = document.querySelector(".modal-content");
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

const searchInput = document.getElementById('search');
const genderFilter = document.getElementById('genderFilter');
const sortOrder = document.getElementById('sortOrder');

let allUsers = [];

function createUserCard(user) {
  const card = document.createElement('div');
  card.className = 'user-card';
  card.innerHTML = `
    <img src="${user.picture.large}" alt="User picture" />
    <h3>${user.name.first} ${user.name.last}</h3>
    <p>${user.email}</p>
  `;
  card.addEventListener('click', () => showModal(user, card));
  return card;
}

function showModal(user, card) {
  const rect = card.getBoundingClientRect();

  modal.classList.remove('hidden');
  modalContent.style.setProperty('--start-top', `${rect.top}px`);
  modalContent.style.setProperty('--start-left', `${rect.left}px`);
  modalContent.style.setProperty('--start-width', `${rect.width}px`);
  modalContent.style.setProperty('--start-height', `${rect.height}px`);

  modalBody.innerHTML = `
    <img class="modal-avatar" src="${user.picture.large}" alt="User picture" />
    <h2>${user.name.first} ${user.name.last}</h2>
    <p><strong>Gender:</strong> ${user.gender}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Phone:</strong> ${user.phone}</p>
    <p><strong>City:</strong> ${user.location.city}</p>
    <p><strong>Age:</strong> ${user.dob.age}</p>
  `;
}

modalClose.addEventListener('click', () => {
  modal.classList.add('hidden');
});

function renderUsers(users) {
  userList.innerHTML = '';
  users.forEach(user => {
    userList.appendChild(createUserCard(user));
  });
}

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const gender = genderFilter.value;
  const order = sortOrder.value;

  let filtered = [...allUsers];

  if (gender) {
    filtered = filtered.filter(u => u.gender === gender);
  }

  if (search) {
    filtered = filtered.filter(u =>
      u.name.first.toLowerCase().includes(search) ||
      u.name.last.toLowerCase().includes(search)
    );
  }

  filtered.sort((a, b) => {
    const nameA = a.name.first + ' ' + a.name.last;
    const nameB = b.name.first + ' ' + b.name.last;
    return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  renderUsers(filtered);
}

searchInput.addEventListener('input', applyFilters);
genderFilter.addEventListener('change', applyFilters);
sortOrder.addEventListener('change', applyFilters);

function showSkeletons(count) {
  userList.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';
    userList.appendChild(skeleton);
  }
}

function loadUsers() {
  showSkeletons(8);
  fetch('https://randomuser.me/api/?results=20')
    .then(res => res.json())
    .then(data => {
      allUsers = data.results;
      applyFilters();
    })
    .catch(err => {
      userList.innerHTML = "<p>Failed to load users</p>";
      console.error(err);
    });
}

loadUsers();
