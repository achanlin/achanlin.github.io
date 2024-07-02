document.addEventListener("DOMContentLoaded", function() {
  const commentForm = document.getElementById("commentForm");
  const commentsContainer = document.getElementById("comments");
  
  

  // Load comments from local storage
  loadComments();

  commentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const comment = document.getElementById("comment").value;
    const email = document.getElementById("email").value;

    const commentData = {
      name: name,
      comment: comment,
      email: email,
      date: new Date().toISOString(),
      replies: []
    };

    // Save comment
    saveComment(commentData);

    // Append comment to the DOM
    appendComment(commentData);

    // Clear form fields
    document.getElementById("name").value = "";
    document.getElementById("comment").value = "";
    document.getElementById("email").value = "";
  });

  function saveComment(commentData) {
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push(commentData);
    localStorage.setItem('comments', JSON.stringify(comments));
  }

  function loadComments() {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.forEach(comment => appendComment(comment));
  }

  function appendComment(commentData) {
    const newComment = document.createElement("div");
    newComment.classList.add("comment");
    newComment.innerHTML = `
      <p><strong>${commentData.name}</strong> says:</p>
      <p>${commentData.comment}</p>
      ${commentData.email ? `<p>Email: ${commentData.email}</p>` : ""}
      <button class="delete-btn">Delete</button>
      <form class="reply-form">
        <input type="text" placeholder="Your Reply">
        <button type="submit">Reply</button>
      </form>
      <div class="replies"></div>
    `;

    commentsContainer.appendChild(newComment);

    // Delete comment button functionality
    const deleteBtn = newComment.querySelector(".delete-btn");
    let deleteClicks = 0; // Track number of delete button clicks
    deleteBtn.addEventListener("click", function() {
      deleteClicks++;
      if (deleteClicks === 2) {
        if (confirm("Are you sure you want to delete this comment?")) {
          newComment.remove();
          deleteComment(commentData);
        }
        deleteClicks = 0; // Reset delete clicks counter
      }
    });

    // Reply to comment functionality
    const replyForm = newComment.querySelector(".reply-form");
    replyForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const replyInput = replyForm.querySelector("input[type='text']");
      const replyText = replyInput.value;
      const reply = document.createElement("div");
      reply.classList.add("comment", "reply");
      reply.innerHTML = `<p><strong>You</strong> replied:</p><p>${replyText}</p>`;
      newComment.querySelector(".replies").appendChild(reply);
      replyInput.value = "";

      // Save reply
      commentData.replies.push({
        name: 'You',
        comment: replyText,
        date: new Date().toISOString()
      });
      updateComment(commentData);
    });
  }

  function deleteComment(commentData) {
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments = comments.filter(comment => comment.date !== commentData.date);
    localStorage.setItem('comments', JSON.stringify(comments));
  }

  function updateComment(commentData) {
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    const index = comments.findIndex(comment => comment.date === commentData.date);
    if (index > -1) {
      comments[index] = commentData;
      localStorage.setItem('comments', JSON.stringify(comments));
    }
  }
});
