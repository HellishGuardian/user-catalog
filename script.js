const userList = document.getElementById('user-list');

fetch('https://randomuser.me/api/?results=8')
  .then(res => res.json())
  .then(data => {
    data.results.forEach(user => {
      const card = document.createElement('div');
      card.className = 'user-card';
      card.innerHTML = `
        <img src="${user.picture.large}" alt="User picture" />
        <h3>${user.name.first} ${user.name.last}</h3>
        <p>${user.email}</p>
      `;
      userList.appendChild(card);
    });
  })
  .catch(err => {
    userList.innerHTML = "<p>Failed to load users</p>";
    console.error(err);
  });
