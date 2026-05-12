document.addEventListener("DOMContentLoaded", function () {
  var link = document.querySelector(".wy-breadcrumbs-aside a");
  if (link && link.textContent.trim() === "在 GitHub 上编辑") {
    link.textContent = "跳转到Github";
  }
});