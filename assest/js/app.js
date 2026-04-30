const burger = document.querySelector(".nav_icon");

if (burger) {
  burger.addEventListener("click", function () {
    const navmenu = document.querySelector(".nav_left");
    console.log(navmenu);

    if (navmenu.style.transform=== "translateY(-500px)") {
      navmenu.style.transform = "translateY(0px)";
    } else {
      navmenu.style.transform = "translateY(-500px)";
    }
  });
}

 
// navmenu.style.transform === "translateX(-500px)"


var loader =document.getElementById("loader");
window.addEventListener("load",function (){
  loader.style.display="none";
  this.setTimeout(function(){
    $('#load').delay(150).fadeout("slow");
  },30000);
})