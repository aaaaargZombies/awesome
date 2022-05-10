const url = "https://devtest.awesomebeta.com/api/ideas";
const lists = document.querySelectorAll("ul");
const ideaLists = {
  open: lists[0],
  "in-review": lists[1],
  accepted: lists[2],
};

const formatDate = (dateStr) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));

const ideaLi = (ideaObject) => {
  let innerHTML = `<a class="idea_title" href="#">${ideaObject.name}</a>
		${
      ideaObject.status === "accepted"
        ? `<p class="idea_approved">Accepted: ${formatDate(
            // i didn't see an approved at date in the JSON so used "updated_at"
            ideaObject.updated_at,
          )}</p>`
        : `<div class="idea_stats">
						<img src="img/heart.svg" alt="heart icon" />
						<p class="hearts">${ideaObject.likes}</p>
						<img src="img/comment_icon.svg" alt="comment icon" />
						<p class="comments">${ideaObject.comments}</p>`
    }
					</div>`;
  let idea = document.createElement("li");
  idea.classList.add("idea");
  idea.innerHTML = innerHTML;
  return idea;
};

fetch(url)
  .then((res) => {
    if (res.status < 400) return res;
    throw new Error(res.statusText);
  })
  .then((res) => res.json())
  .then((json) => json.data[0])
  .then((data) =>
    data.reduce((acc, curr) => {
      const { name, likes, status, updated_at } = curr;
      const comments =
        curr.user_interactions.length +
        curr.user_interactions.reduce((acc, curr) => {
          return acc + curr.replies.length;
        }, 0);
      acc.push({ name, likes, status, comments, updated_at });
      return acc;
    }, []),
  )
  .then((ideas) =>
    ideas.forEach((ideaObject) => {
      ideaLists[ideaObject.status].appendChild(ideaLi(ideaObject));
    }),
  )
  .catch(console.log);
