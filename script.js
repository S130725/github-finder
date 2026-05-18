const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#search-btn");
const profileContainer = document.querySelector("#profile-container");
const errorContainer = document.querySelector(".error-container");
const avatar = document.querySelector("#avatar");
const nameElement = document.querySelector("#name");
const usernameElement = document.querySelector("#username");
const bioElement = document.querySelector("#bio");
const locationElement = document.querySelector("#location");
const joinedDateElement = document.querySelector("#joined-date");
const profileLink = document.querySelector("#profile-link");
const followers = document.querySelector("#followers");
const following = document.querySelector("#following");
const repos = document.querySelector("#repos");
const companyElement = document.querySelector(".company");
const blogElement = document.querySelector("#blog");
const twitterElement = document.querySelector("#twitter");
const companyContainer = document.querySelector("#company-container");
const blogContainer = document.querySelector("#blog-container");
const twitterContainer = document.querySelector("#twitter-container");
const reposContainer = document.querySelector(".repos-container");

searchBtn.addEventListener("click", searchUser)
searchInput.addEventListener("keypress", (e) =>{
    if(e.key === "Enter") searchUser()
})

 async function searchUser(){
    const username = searchInput.value.trim();

    if(!username) return alert ("please enter a username");

try {
    // reset the ui
    profileContainer.classList.add("hidden")
    errorContainer.classList.add("hidden")
    // https://api.github.com/users/burakormez
    const response = await fetch(`https://api.github.com/users/${username}`)
    if(!response.ok) throw new Error("user not found");
    
    const userData = await response.json();
    console.log( "user data here" ,userData);

    displayUserData(userData);

    fetchRepositories(userData.repos_url);
} catch (error) {
    showError()
}
 }

  async function fetchRepositories(reposUrl) {
reposContainer.innerHTML = '<div class="loading-repos">Loading repostitories...</div>'

try {
    const response = await fetch(reposUrl + "?per_page=6");
    const repos = await response.json()
    displayRepos(repos)

} catch (error) {
    reposContainer.innerHTML = '<div class="no-repos">${error.message}</div>'

}
 }

function displayRepos (repos) {
    if(repos.length === 0) {
        reposContainer.innerHTML = `<div class="no-repos">no repositories found</div>`;
        return;
    }
    reposContainer.innerHTML = ""

    repos.forEach(repo => {
        const repoCard = document.createElement("div")
        repoCard.className = "repo-card"

        const updatedAt = formatDate(repo.updated_at)


         repoCard.innerHTML = `
      <a href="${repo.html_url}" target="_blank" class="repo-name">
        <i class="fas fa-code-branch"></i> ${repo.name}
      </a>
      <p class="repo-description">${repo.description || "No description available"}</p>
      <div class="repo-meta">
        ${
          repo.language
            ? `
          <div class="repo-meta-item">
            <i class="fas fa-circle"></i> ${repo.language}
          </div>
        `
            : ""
        }
        <div class="repo-meta-item">
          <i class="fas fa-star"></i> ${repo.stargazers_count}
        </div>
        <div class="repo-meta-item">
          <i class="fas fa-code-fork"></i> ${repo.forks_count}
        </div>
        <div class="repo-meta-item">
          <i class="fas fa-history"></i> ${updatedAt}
        </div>
      </div>
    `;

    reposContainer.appendChild(repoCard);
  });
}

 function displayUserData(user) {
    avatar.src = user.avatar_url
    nameElement.textContent = user.name || user.login
    usernameElement.textContent = `@${user.login}`

    bioElement.textContent = user.bio || "no bio available"

locationElement.textContent = user.location || "not specified"
// todo: format the date
joinedDateElement.textContent =  formatDate(user.created_at)

profileLink.href = user.html_url;
followers.textContent = user.followers;
following.textContent= user.following;
repos.textContent = user.public_repos;

if(user.company) companyElement.textContent = user.company;
else companyElement.textContent = "not specified";

if(user.blog) {
    blogElement.textContent= user.blog;
    blogElement.href = user.blog.startsWith("http") ? user.blog :`https://${user.blog}`;
} else {
    blogElement.textContent = "no website";
    blogElement.href = "#"
}

blogContainer.style.display = "flex";

if (user.twitter_username) {
    twitterElement.textContent = `@${user.twitter_username}`;
    twitterElement.href = `https://twitter.com${user.twitter_username}`;
}
else {
    twitterElement.textContent = "no twitter";
    twitterElement.href = "#"
}

twitterContainer.style.display = "flex";

// show the profile
profileContainer.classList.remove("hidden");
 }
 function showError() {
   errorContainer.classList.remove("hidden")
    profileContainer.classList.add("hidden")
 }

 function formatDate (dateString) {
return new Date(dateString).toLocaleDateString("en-US", {
    year : "numeric",
    month: "short",
    day : "numeric"
});
 }

 searchInput.value = "octocat";
 searchUser()
