window.closeSidebar = function () {
  let sidebarOpen = document.getElementById("sidebar-open");
  let sidebarClose = document.getElementById("sidebar-close");

  sidebarOpen.style.display = "none";
  sidebarClose.style.display = "flex";
};

window.openSidebar = function () {
  let sidebarOpen = document.getElementById("sidebar-open");
  let sidebarClose = document.getElementById("sidebar-close");

  sidebarOpen.style.display = "flex";
  sidebarClose.style.display = "none";
};
