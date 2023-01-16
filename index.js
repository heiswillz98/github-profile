const ApiUrl = 'https://api.github.com/users/';

const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

async function getUser(username) {
  try {
    const { data } = await axios(ApiUrl + username);
    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response.status === 404) {
      createUserError(
        'Are you sure about this? No profile with this username '
      );
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(ApiUrl + username + '/repos?sort=created');
    addRepos(data);
  } catch (err) {
    createUserError('Problem fetching repos');
  }
}

function createUserCard(user) {
  const cardHtml = `
    <div class="card">
    <div>
      <img
        src="${user.avatar_url}"
        alt="${user.name}"
        class="avatar"
      />
    </div>
    <div class="user-info">
      <h2>${user.name}</h2>
      <p>
       ${user.bio}
      </p>
      <ul>
        <li>${user.followers} <strong> Followers</strong></li>
        <li>${user.following} <strong> Following</strong></li>
        <li>${user.public_repos} <strong> repos </strong></li>
      </ul>

      <div id="repos">
      
      </div>
    </div>
  </div>
    `;

  main.innerHTML = cardHtml;
}

function addRepos(repos) {
  const reposEl = document.getElementById('repos');

  repos.slice(0, 5).forEach(repo => {
    const repoEl = document.createElement('a');
    repoEl.classList.add('repo');
    repoEl.href = repo.html_url;
    repoEl.target = '_blank';
    repoEl.innerText = repo.name;
    reposEl.appendChild(repoEl);
  });
}

function createUserError(msg) {
  const cardHtml = `
    <div class='card'>
    <h1>${msg}</h1>
    </div>
    `;

  main.innerHTML = cardHtml;
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = '';
  }
});
