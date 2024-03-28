const postsContainer = document.querySelector(".posts");
const loadingElement = document.getElementById("loading");

// Function to retrieve posts from the server
function getPosts() {
  loadingElement.style.display = "flex";

  axios.get("https://blogpost-fastapi.onrender.com/posts")
    .then(response => {
      if (response.data.length > 0) {
        renderPosts(response.data);
      } else {
        loadingElement.textContent = response.data.detail;
      }
    })
    .catch(error => {
      loadingElement.textContent = error.message;
    });
}

// Function to render posts to the UI
function renderPosts(posts) {
  postsContainer.innerHTML = "";

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    let pinicon = "";
    let editIcon = "";

    if (i >= 0 && i <= 2) {
      pinicon = "bi bi-pin-angle";
      editIcon = "";
    } else {
      pinicon = "bi bi-trash3 del-post";
      editIcon = "bi bi-pencil-square";
    }

    const postElement = `
      <div class="post" id='${post.id}'>
        <div class='top flex-center'>
          <h2 class="title">${post.title}</h2>
          <div class="flex-center gap-5">
            <i class="${editIcon}" id='${post.id}'></i>
            <i class="${pinicon}" id='${post.id}'></i>
          </div>
        </div>
        <p class="content">${post.content}</p>
        <p class="date">${new Date(post.created_at).toLocaleDateString()}</p>
      </div>
    `;

    postsContainer.innerHTML += postElement;
  }

  loadingElement.style.display = "none";
  attachEditEventListeners();
  attachDeleteEventListeners();
}

// Call the function to fetch and display posts
getPosts();

// Function to create post form popup
function createPostPopup() {
  const popupOverlay = document.createElement("div");
  popupOverlay.classList.add("popup-overlay", "flex-center");

  const popupPost = document.createElement("div");
  popupPost.classList.add("popup-post");

  const closeIcon = document.createElement("i");
  closeIcon.classList.add("bi", "bi-x-circle-fill");

  const heading = document.createElement("h1");
  heading.textContent = "Create Post";

  const form = document.createElement("form");
  form.id = "form-create-post";

  const titleLabel = createLabel("Title:", "create-title");
  const titleInput = createInput("text", "create-title", true);
  const contentLabel = createLabel("Content:", "create-content");
  const contentInput = createInput("text", "create-content", true);
  const submitBtn = createInput("submit", "", false, "Submit");

  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));
  form.appendChild(contentLabel);
  form.appendChild(contentInput);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));
  form.appendChild(submitBtn);

  popupPost.appendChild(closeIcon);
  popupPost.appendChild(heading);
  popupPost.appendChild(form);

  popupOverlay.appendChild(popupPost);
  document.body.appendChild(popupOverlay);
  popupOverlay.style.display = "flex";

  form.addEventListener("submit", event => {
    event.preventDefault();
    popupOverlay.remove();
    sendPost(titleInput.value, contentInput.value);
  });

  closeIcon.addEventListener("click", () => {
    popupOverlay.remove();
  });
}

// Function to handle post submission
function sendPost(title, content) {
  axios.post("https://blogpost-fastapi.onrender.com/posts", { title, content })
    .then(() => {
      window.location.reload();
    })
    .catch(error => {
      alert("Error submitting post:", error);
    });
}

// Event listener for creating a new post
const createPostButton = document.querySelector(".create-post");
createPostButton.addEventListener("click", createPostPopup);

// Function to create label element
function createLabel(text, htmlFor) {
  const label = document.createElement("label");
  label.textContent = text;
  label.htmlFor = htmlFor;
  return label;
}

// Function to create input element
function createInput(type, id, required, value) {
  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.required = required;
  if (value) input.value = value;
  return input;
}

// Function to attach edit event listeners
function attachEditEventListeners() {
  document.querySelectorAll(".bi-pencil-square").forEach(btnEdit => {
    btnEdit.onclick = () => {
      const title = btnEdit.parentElement.parentElement.parentElement.querySelector(".title").textContent;
      const content = btnEdit.parentElement.parentElement.parentElement.querySelector(".content").textContent;
      editPost(btnEdit.id, title, content);
    };
  });
}

// Function to attach delete event listeners
function attachDeleteEventListeners() {
  const btnsDels = document.querySelectorAll(".del-post");
  btnsDels.forEach(btnDel => {
    btnDel.addEventListener("click", () => {
      axios.delete(`https://blogpost-fastapi.onrender.com/posts/${btnDel.id}`)
        .catch(error => {
          alert("Error:", error);
        });
      btnDel.parentElement.parentElement.parentElement.remove();
    });
  });
}

// Function to edit post
function editPost(id, title, content) {
  const popupOverlay = document.createElement("div");
  popupOverlay.classList.add("popup-overlay", "flex-center");

  const popupPost = document.createElement("div");
  popupPost.classList.add("popup-post");

  const closeIcon = document.createElement("i");
  closeIcon.classList.add("bi", "bi-x-circle-fill");

  const heading = document.createElement("h1");
  heading.textContent = "Edit Post";

  const form = document.createElement("form");
  form.id = "form-create-post";

  const titleLabel = createLabel("Title:", "create-title");
  const titleInput = createInput("text", "create-title", true, title);
  const contentLabel = createLabel("Content:", "create-content");
  const contentInput = createInput("text", "create-content", true, content);
  const submitBtn = createInput("submit", "", false, "Submit");

  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));
  form.appendChild(contentLabel);
  form.appendChild(contentInput);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));
  form.appendChild(submitBtn);

  popupPost.appendChild(closeIcon);
  popupPost.appendChild(heading);
  popupPost.appendChild(form);

  popupOverlay.appendChild(popupPost);
  document.body.appendChild(popupOverlay);
  popupOverlay.style.display = "flex";

  form.addEventListener("submit", event => {
    event.preventDefault();
    popupOverlay.remove();
    putPost(id, titleInput.value, contentInput.value);
  });

  closeIcon.addEventListener("click", () => {
    popupOverlay.remove();
  });
}

// Function to update post
function putPost(id, title, content) {
  axios.put(`https://blogpost-fastapi.onrender.com/posts/${id}`, { title, content })
    .then(() => {
      window.location.reload();
    });
}
