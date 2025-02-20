
let animationRunning = true;
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const elements = document.querySelectorAll('.hidden');

    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate');
        el.classList.remove('hidden');

        // 🔥 Force un reflow pour les éléments absolus 🔥
        el.offsetHeight;

      }, index * 40);

      el.addEventListener('animationend', () => {
        el.classList.remove('animate');
      });
    });
  }, 10);
});


const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

const cursor = document.querySelector(".cursor");

circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = "white";
});

window.addEventListener("mousemove", function (e) {
  coords.x = e.clientX;
  coords.y = e.clientY;
});
var hoving = false;
function animateCircles() {

  let x = coords.x;
  let y = coords.y;

  cursor.style.top = x;
  cursor.style.left = y;

  circles.forEach(function (circle, index) {
    if (hoving) {
      circle.style.left = x - 15 + "px";
      circle.style.top = y - 15 + "px";
    } else {
      circle.style.left = x - 15 + "px";
      circle.style.top = y - 15 + "px";
    }
    circle.style.scale = (circles.length - index) / circles.length;

    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * 0.1;
    y += (nextCircle.y - y) * 0.1;
  });

  requestAnimationFrame(animateCircles);

}

animateCircles();

//si le souris sort de l'écran ou n'est pas détecter
window.addEventListener("mouseout", function () {
  cursor.style.display = "none";
});
//sinon, le curseur apparait
window.addEventListener("mouseover", function () {
  cursor.style.display = "block";
  //enlev la souris et ne laisse que les sercles et la dive curseur
  document.body.style.cursor = "none";

});

//quand le cuseur survole un lien
document.querySelectorAll("a").forEach(function (a) {
  a.addEventListener("mouseover", function () {
    circles.forEach(function (circle) {
      circle.classList.add("scaled")
    });
  });
  a.addEventListener("mouseout", function () {
    circles.forEach(function (circle) {
      circle.classList.remove("scaled")
    });
  });
});
document.querySelectorAll(".mouseDown_inf").forEach(function (mouseDown_inf) {
  mouseDown_inf.addEventListener("mouseover", function () {
    circles.forEach(function (circle) {
      circle.classList.add("scaled")
    });
  });
  mouseDown_inf.addEventListener("mouseout", function () {
    circles.forEach(function (circle) {
      circle.classList.remove("scaled")
    });
  });
});

const scrollers = document.querySelectorAll(".scrollers");

// If a user hasn't opted in for recuded motion, then we add the animation
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addAnimation();
}

function addAnimation() {
  scrollers.forEach((scroller) => {
    // add data-animated="true" to every `.scroller` on the page
    scroller.setAttribute("data-animated", true);

    // Make an array from the elements within `.scroller-inner`
    const scrollerInner = scroller.querySelector(".scroller__inner");
    const scrollerContent = Array.from(scrollerInner.children);

    // For each item in the array, clone it
    // add aria-hidden to it
    // add it into the `.scroller-inner`
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}



// Les 3 premiers éléments de la page sont invisibles
document.querySelectorAll(".hidden").forEach((el) => {
  el.classList.remove("hidden");
});
