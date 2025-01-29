


const firebaseConfig = {
    apiKey: "AIzaSyDW27s6cl-NxO8bf3hzYAMm-Vw8mk9DgrQ",
    authDomain: "limage-ab2b4.firebaseapp.com",
    databaseURL: "https://limage-ab2b4-default-rtdb.firebaseio.com",
    projectId: "limage-ab2b4",
    storageBucket: "limage-ab2b4.appspot.com",
    messagingSenderId: "511599905817",
    appId: "1:511599905817:web:3f0ffb7ae59f226cbdee88",
    measurementId: "G-YP7YGFP2P2"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const siteId = 'codealuxz';  // Change cet ID pour chaque site


// Fonction pour vérifier si l'IP est bloquée
async function checkBlocked() {
    const ip = await fetch('https://api64.ipify.org?format=json').then(res => res.json()).then(data => data.ip);
    const sanitizedIp = ip.replace(/\./g, '-'); // Remplace les points par des tirets

    const blockedRef = db.ref(`blockedIPs/${siteId}`);
    blockedRef.child(sanitizedIp).get().then((snapshot) => {
        if (snapshot.exists()) {
            alert('Votre accès est bloqué sur ce site.');
            document.body.innerHTML = '';
        } else {
            addVisit();
            addConnection();
        }
    });
}

// Enregistrer les clics et logs de la console dans Firebase
async function logActivity(eventType, details) {
    const ip = await fetch('https://api64.ipify.org?format=json').then(res => res.json()).then(data => data.ip);
    const sanitizedIp = ip.replace(/\./g, '-'); // Remplace les points par des tirets
    const logRef = db.ref(`userLogs/${siteId}/${sanitizedIp}/${Date.now()}`);
    const userAgent = navigator.userAgent;
    logRef.set({
        eventType,
        details,
        timestamp: new Date().toISOString(),
        deviceInfo: userAgent // Ajoute les informations sur l'appareil
    });
}

// Enregistrement des clics de l'utilisateur
document.addEventListener('click', (event) => {
    const element = event.target;
    const elementDetails = {
        tag: element.tagName,
        id: element.id || 'N/A',
        class: element.className || 'N/A',
        text: element.innerText || 'N/A',
        pageX: event.pageX,
        pageY: event.pageY
    };
    logActivity('click', elementDetails);
});

// Redirection des messages console vers Firebase
const originalConsoleLog = console.log;

console.log = function (...args) {
    originalConsoleLog.apply(console, args); // Affiche le message dans la console
    logActivity('console.log', args.join(' '));
};

// Fonction pour enregistrer l'IP de l'utilisateur
async function logUserIP() {
    try {
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;
        const sanitizedIp = ip.replace(/\./g, '-');
        const ipRef = db.ref(`visitors/${siteId}/ips/${sanitizedIp}`);

        await ipRef.set({
            timestamp: new Date().toISOString()
        });

        console.log(`Adresse IP ${ip} enregistrée.`);
        db.ref(`activeVisitors/${siteId}/${sanitizedIp}`).set(true);

        window.addEventListener('beforeunload', () => {
            db.ref(`activeVisitors/${siteId}/${sanitizedIp}`).remove();
        });

        const visitsRef = firebase.database().ref(`visites/${siteId}/totale`);
        visitsRef.once('value')
            .then((snapshot) => {
                const totalVisits = snapshot.val() || 0;
                db.ref(`visites/${siteId}/totale`).set(totalVisits + 1);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des visites :", error);
            });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'adresse IP:', error);
        alert('Erreur lors du chargement. Veuillez recharger la page.');
    }
}

// Appel des fonctions pour chaque visiteur
logUserIP();
checkBlocked();


// Fonction pour ajouter une croix rouge à des coordonnées spécifiques
function addCross(x, y) {
    const cross = document.createElement('div');
    cross.style.position = 'absolute';
    cross.style.left = `${x}px`;
    cross.style.top = `${y}px`;
    cross.style.width = '10px';
    cross.style.height = '10px';
    cross.style.backgroundColor = 'red';
    cross.style.transform = 'rotate(45deg)'; // Pour créer une croix
    cross.style.border = '1px solid red';
    document.body.appendChild(cross);
}

// Écouteur d'événements pour détecter le code 2309
document.addEventListener('keydown', (event) => {
    // Code pour le chiffre '2'
    if (event.code === 'Digit2') {
        // On attend les chiffres suivants pour former '2309'
        let inputSequence = '2';

        const keyHandler = (event) => {
            inputSequence += event.key; // Ajoute la touche pressée à la séquence

            if (inputSequence === '2309') {
                // Lorsque le code 2309 est saisi
                document.removeEventListener('keydown', keyHandler); // Retire l'écouteur d'événements
                const x = prompt("Entrez les coordonnées X :");
                const y = prompt("Entrez les coordonnées Y :");

                if (x !== null && y !== null) {
                    addCross(Number(x), Number(y));
                }
            } else if (inputSequence.length > 4) {
                // Réinitialiser si trop de chiffres
                inputSequence = '';
            }
        };

        document.addEventListener('keydown', keyHandler);
    }
});
async function checkReload() {
    const ip = await fetch('https://api64.ipify.org?format=json').then(res => res.json()).then(data => data.ip);
    const sanitizedIp = ip.replace(/\./g, '-');
    const reloadRef = db.ref(`reload/${siteId}/${sanitizedIp}`);

    reloadRef.once('value')
        .then((snapshot) => {
            if (snapshot.val() === true) {
                location.reload(); // Recharge la page si true
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la vérification du rechargement :", error);
        });
}

// Appel de la fonction régulièrement
setInterval(checkReload, 100); // Vérifie toutes les secondes


document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll('.hidden'); // Sélectionne tous les éléments cachés
  
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate');
        el.classList.remove('hidden'); // Supprime la classe "hidden" pour commencer l'animation
      }, index * 50); // Délais personnalisés (300ms entre chaque élément)
  
      // Écoute la fin de l'animation pour supprimer la classe "animate"
      el.addEventListener('animationend', () => {
        el.classList.remove('animate'); // Supprime la classe "animate" après l'animation
      });
    });
  });
  
