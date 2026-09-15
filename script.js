const sidebar = document.getElementById("sidebar");
const sidebarBtn = document.getElementById("sidebar-btn");
const sidebarOverlay = document.getElementById("sidebar-overlay");

if (!sidebar.classList.contains("closed")) {
    sidebarOverlay.classList.add("active");
}

sidebarBtn.addEventListener("click", () => {

    sidebar.classList.toggle("closed");

    if (sidebar.classList.contains("closed")) {
        sidebarOverlay.classList.remove("active");
    } else {
        sidebarOverlay.classList.add("active");
    }

});

sidebarOverlay.addEventListener("click", () => {

    sidebar.classList.add("closed");
    sidebarOverlay.classList.remove("active");

});
