
let animationRunning = true;
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll('.hidden'); // Sélectionne tous les éléments cachés

  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('animate');
      el.classList.remove('hidden'); // Supprime la classe "hidden" pour commencer l'animation
    }, index * 40); // Délais personnalisés (300ms entre chaque élément)

    // Écoute la fin de l'animation pour supprimer la classe "animate"
    el.addEventListener('animationend', () => {
      el.classList.remove('animate'); // Supprime la classe "animate" après l'animation
    });
  });
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
      circle.style.left = x - 25 + "px";
      circle.style.top = y - 25 + "px";
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
    cursor.style.mixBlendMode = "overlay";        
  });
  a.addEventListener("mouseout", function () {
    cursor.style.mixBlendMode = "difference";
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
