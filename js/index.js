document.addEventListener('DOMContentLoaded', () => {
    const repoSub = document.createElement('input');
    repoSub.setAttribute('type', 'submit');
    repoSub.setAttribute('value', 'search repos');
    const form = document.getElementById('github-form');
    const userSub = form.querySelector('[name="submit"]');
    userSub.setAttribute('value', 'search users');
    form.appendChild(repoSub);
    document.getElementById('github-form').addEventListener('submit', handleSearch);
})

function handleSearch(event) {
    event.preventDefault();
    let searchType;
    const value = document.getElementById('search').value;
    if (event.submitter.defaultValue === 'search repos') {
        fetch(`https://api.github.com/search/repositories?q=${value}`)
        .then(res => res.json())
        .then(json => listResultsRepos(json.items));
    } else if (event.submitter.defaultValue === 'search users') {
        fetch(`https://api.github.com/search/users?q=${value}`)
        .then(res => res.json())
        .then(json => listResultsUsers(json.items));
    };
}

function listResultsUsers(results) {
    const userList = document.getElementById('user-list');
    clearList(userList);
    clearList(document.getElementById('repos-list'));
    results.forEach(element => {
        const card = document.createElement('li');
        const userName = document.createElement('p');
        const avatar = document.createElement('img');
        const url = document.createElement('a');
        const br = document.createElement('br');
        userName.setAttribute('class', 'userName');
        userName.innerText = element.login;
        avatar.setAttribute('src', element.avatar_url);
        avatar.setAttribute('style', 'width:200px;height:200px');
        url.setAttribute('href', element.url);
        url.innerText = element.url;
        userList.appendChild(card);
        card.appendChild(userName);
        card.appendChild(avatar);
        card.appendChild(br);
        card.appendChild(url);
        card.addEventListener('click', handleSelection);
    });
}

function listResultsRepos(results) {
    const userList = document.getElementById('user-list');
    clearList(userList);
    clearList(document.getElementById('repos-list'));
    results.forEach(element => {
        const card = document.createElement('li');
        const userName = document.createElement('p');
        const avatar = document.createElement('img');
        const url = document.createElement('a');
        const br = document.createElement('br');
        userName.setAttribute('class', 'userName');
        userName.innerText = element.name;
        avatar.setAttribute('src', element.owner.avatar_url);
        avatar.setAttribute('style', 'width:200px;height:200px');
        url.setAttribute('href', element.url);
        url.innerText = element.url;
        userList.appendChild(card);
        card.appendChild(userName);
        card.appendChild(avatar);
        card.appendChild(br);
        card.appendChild(url);
    });
}

function handleSelection(event) {
    const reposList = document.getElementById('repos-list');
    clearList(reposList);
    let card;
    if (event.target.nodeName === 'LI') {
        card = event.target;
    } else {
        card = event.target.parentNode;
    };
    const userName = card.querySelector('.userName').innerText;
    fetch(`https://api.github.com/users/${userName}/repos`)
    .then(res => res.json())
    .then(json => {
        const nameTitle = document.createElement('h2');
        nameTitle.innerText = userName + "'s Repos:";
        reposList.appendChild(nameTitle);
        json.forEach(element => {
            const li = document.createElement('li');
            const repoName = document.createElement('a');
            repoName.innerText = element.name;
            repoName.setAttribute('href', element.html_url);
            repoName.setAttribute('target', '_blank');
            repoName.setAttribute('rel', 'noopener noreferrer');
            li.appendChild(repoName)
            reposList.appendChild(li);
        })
    })
}

function clearList(list) {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    };
}