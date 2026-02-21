const body = document.body;
const toggle = document.getElementById("modeToggle");

function setTheme(theme){
  body.classList.toggle("dark", theme === "dark");
  body.classList.toggle("light", theme !== "dark");
  toggle.classList.toggle("active", theme === "dark");
  localStorage.setItem("gp_theme", theme);
}

setTheme(localStorage.getItem("gp_theme") || "light");

toggle.addEventListener("click", ()=> {
  setTheme(body.classList.contains("dark") ? "light" : "dark");
});

toggle.addEventListener("keydown", (e)=> {
  if(e.key==="Enter"||e.key===" "){
    e.preventDefault();
    toggle.click();
  }
});
