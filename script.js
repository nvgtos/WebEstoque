const sidebar = document.getElementById("sidebar");
const sidebarBtn = document.getElementById("sidebar-btn");

sidebarBtn.addEventListener("click", () => {sidebar.classList.toggle("closed");});
