import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2n91JDJLDoINvYmGtHJwzZPeVB4rPZsM",
  authDomain: "freitas-web-design.firebaseapp.com",
  projectId: "freitas-web-design",
  storageBucket: "freitas-web-design.firebasestorage.app",
  messagingSenderId: "345222086620",
  appId: "1:345222086620:web:a92d7ed5615e5399c8d919",
  measurementId: "G-E230C8P0D9"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const projectsContainer =
document.getElementById("projectsContainer");

async function carregarProjetos(){

  const querySnapshot =
  await getDocs(collection(db,"projetos"));

  querySnapshot.forEach((doc)=>{

    const projeto = doc.data();

    projectsContainer.innerHTML += `

    <div class="project">

      <img src="${projeto.imagem}">

      <div class="project-content">

        <h3>${projeto.titulo}</h3>

        <a href="${projeto.link}"
        target="_blank">
        Ver Projeto
        </a>

      </div>

    </div>

    `;

  });

}

carregarProjetos();
