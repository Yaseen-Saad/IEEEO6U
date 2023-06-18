const params = new URLSearchParams(location.search);
const committee = params.get("committee");
const Videos = {
  CS: "https://www.youtube.com/watch?v=7LTttej4i3A",
  HR: "https://www.youtube.com/watch?v=7LTttej4i3A",
  PR: "https://www.youtube.com/watch?v=7LTttej4i3A",
  MM: "https://www.youtube.com/watch?v=7LTttej4i3A",
  MA: "https://www.youtube.com/watch?v=7LTttej4i3A",
  EM: "https://www.youtube.com/watch?v=7LTttej4i3A",
  RAS: "https://www.youtube.com/watch?v=7LTttej4i3A",
  FR: "https://www.youtube.com/watch?v=7LTttej4i3A",
  EC: "https://www.youtube.com/watch?v=7LTttej4i3A",
};
if (!Videos[committee]) {
    const currentHistoryIndex = window.history.length - 1;

    // If the current history index is greater than 0, go to the previous history entry
    if (currentHistoryIndex > 0) {
      window.history.go(-1);
    }
}else{

const iframe = document.querySelector("iframe");

iframe.src =
"https://www.youtube.com/embed/" + Videos[committee].split("v=")[1];

onload = async () => {
  toggleLoader("this-is-loader");
  pauseAnimation();
};
}