document.addEventListener("DOMContentLoaded", function() {
  const commentForm = document.getElementById("commentForm");
  const commentsContainer = document.getElementById("comments");

  commentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const comment = document.getElementById("comment").value;
    const email = document.getElementById("email").value;

    // Create a new comment element
    const newComment = document.createElement("div");
    newComment.classList.add("comment");
    newComment.innerHTML = `
      <p><strong>${name}</strong> says:</p>
      <p>${comment}</p>
      ${email ? `<p>Email: ${email}</p>` : ""}
      <button class="delete-btn">Delete</button>
      <form class="reply-form">
        <input type="text" placeholder="Your Reply">
        <button type="submit">Reply</button>
      </form>
      <div class="replies"></div>
    `;

    commentsContainer.appendChild(newComment);

    // Clear form fields
    document.getElementById("name").value = "";
    document.getElementById("comment").value = "";
    document.getElementById("email").value = "";

    // Delete comment button functionality
	/*
    const deleteBtn = newComment.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function() {
      if (confirm("Are you sure you want to delete this comment?")) {
        newComment.remove();
      }
    });

	*/
	const deleteBtn = newComment.querySelector(".delete-btn");
    let deleteClicks = 0; // Track number of delete button clicks
    deleteBtn.addEventListener("click", function() {
      deleteClicks++;
      if (deleteClicks === 2) {
        if (confirm("Are you sure you want to delete this comment?")) {
          newComment.remove();
        }
        deleteClicks = 0; // Reset delete clicks counter
      } else; 
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
    });
  });
});
