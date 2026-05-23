import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword,
onAuthStateChanged,
signOut
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getStorage,
ref,
uploadBytes,
getDownloadURL
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {

apiKey: "AIzaSyB2n91JDJLDoINvYmGtHJwzZPeVB4rPZsM",

authDomain: "freitas-web-design.firebaseapp.com",

projectId: "freitas-web-design",

storageBucket: "freitas-web-design.firebasestorage.app",

messagingSenderId: "345222086620",

appId: "1:345222086620:web:a92d7ed5615e5399c8d919"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

const loginModal =
document.getElementById("loginModal");

const adminToggle =
document.getElementById("adminToggle");

const sidebarAdmin =
document.getElementById("sidebarAdmin");

adminToggle.onclick = ()=>{

sidebarAdmin.classList.toggle("active");

}

document.addEventListener("keydown",(e)=>{

if(e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a"){

loginModal.style.display = "flex";

}

});

document.getElementById("secretTrigger")
.addEventListener("dblclick",()=>{

loginModal.style.display = "flex";

});

window.login = async function(){

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

}catch(error){

alert("Login inválido");

}

}

onAuthStateChanged(auth,(user)=>{

if(user){

loginModal.style.display = "none";

adminToggle.style.display = "flex";

carregarProjetosAdmin();

}else{

adminToggle.style.display = "none";

sidebarAdmin.classList.remove("active");

}

});

window.logout = async function(){

await signOut(auth);

location.reload();

}

window.salvarProjeto = async function(){

const titulo =
document.getElementById("titulo").value;

const descricao =
document.getElementById("descricao").value;

const link =
document.getElementById("link").value;

const imagens =
document.getElementById("imagem").files;

if(imagens.length === 0){

alert("Selecione imagens");

return;

}

try{

let imagensUrls = [];

for(let i = 0; i < imagens.length; i++){

const imagem = imagens[i];

const storageRef =
ref(
storage,
"projetos/" + Date.now() + imagem.name
);

await uploadBytes(storageRef,imagem);

const imageUrl =
await getDownloadURL(storageRef);

imagensUrls.push(imageUrl);

}

await addDoc(collection(db,"projetos"),{

titulo,
descricao,
link,
imagens: imagensUrls,
criadoEm:new Date()

});

alert("Projeto publicado!");

location.reload();

}catch(error){

console.log(error);

alert("Erro ao publicar");

}

}

async function carregarProjetos(){

const projectsContainer =
document.getElementById("projectsContainer");

projectsContainer.innerHTML = "";

const querySnapshot =
await getDocs(collection(db,"projetos"));

querySnapshot.forEach((project)=>{

const data = project.data();

projectsContainer.innerHTML += `

<div class="project-card">

<div class="project-gallery">

${data.imagens.map(img => `

<img src="${img}">

`).join('')}

</div>

<div class="project-content">

<h3>${data.titulo}</h3>

<p>${data.descricao}</p>

<a href="${data.link}" target="_blank">

Ver Projeto →

</a>

</div>

</div>

`;

});

}

async function carregarProjetosAdmin(){

const adminProjects =
document.getElementById("adminProjects");

adminProjects.innerHTML = "";

const querySnapshot =
await getDocs(collection(db,"projetos"));

querySnapshot.forEach((project)=>{

const data = project.data();

adminProjects.innerHTML += `

<div class="admin-item">

<h3>
${data.titulo}
</h3>

<button
class="delete-btn"
onclick="deletarProjeto('${project.id}')">

Excluir Projeto

</button>

</div>

`;

});

}

window.deletarProjeto = async function(id){

await deleteDoc(doc(db,"projetos",id));

location.reload();

}

carregarProjetos();
