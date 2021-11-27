const templates = document.querySelectorAll(".templates");

templates.forEach((template, value) => {
  template.addEventListener("click", () => {
    console.log(value);
  });
});
