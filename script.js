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
doc,
query,
orderBy
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

apiKey: "AIzaSyB2n91JDJLDoINvYmGtHJwzZPeVB4rPZsM",

authDomain: "freitas-web-design.firebaseapp.com",

projectId: "freitas-web-design",

storageBucket: "freitas-web-design.appspot.com",

messagingSenderId: "345222086620",

appId: "1:345222086620:web:a92d7ed5615e5399c8d919"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const loginModal =
document.getElementById("loginModal");

const adminToggle =
document.getElementById("adminToggle");

const sidebarAdmin =
document.getElementById("sidebarAdmin");

const projectsContainer =
document.getElementById("projectsContainer");

const adminProjects =
document.getElementById("adminProjects");

adminToggle.onclick = ()=>{

sidebarAdmin.classList.toggle("active");

}

document.addEventListener("keydown",(e)=>{

if(
e.ctrlKey &&
e.shiftKey &&
e.key.toLowerCase() === "a"
){

loginModal.style.display = "flex";

}

});

document
.getElementById("secretTrigger")
.addEventListener("dblclick",()=>{

loginModal.style.display = "flex";

});

window.login = async function(){

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

if(!email || !password){

alert("Preencha email e senha");

return;

}

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

loginModal.style.display = "none";

}catch(error){

console.log(error);

alert("Login inválido");

}

}

onAuthStateChanged(auth,(user)=>{

if(user){

adminToggle.style.display = "flex";

carregarProjetosAdmin();

}else{

adminToggle.style.display = "none";

sidebarAdmin.classList.remove("active");

}

});

window.logout = async function(){

await signOut(auth);

sidebarAdmin.classList.remove("active");

location.reload();

}

window.salvarProjeto = async function(){

const titulo =
document.getElementById("titulo").value.trim();

const descricao =
document.getElementById("descricao").value.trim();

const link =
document.getElementById("link").value.trim();

const imagemInput =
document.getElementById("imagem");

const imagens =
imagemInput.files;

if(!titulo || !descricao || !link){

alert("Preencha todos os campos");

return;

}

let imagensUrls = [];

try{

if(imagens.length > 0){

for(let i = 0; i < imagens.length; i++){

const imagem = imagens[i];

const reader = new FileReader();

const base64 = await new Promise((resolve)=>{

reader.onload = () => resolve(reader.result);

reader.readAsDataURL(imagem);

});

imagensUrls.push(base64);

}

}

await addDoc(collection(db,"projetos"),{

titulo,
descricao,
link,
imagens: imagensUrls,
criadoEm: new Date()

});

alert("Projeto publicado com sucesso!");

document.getElementById("titulo").value = "";

document.getElementById("descricao").value = "";

document.getElementById("link").value = "";

imagemInput.value = "";

await carregarProjetos();

await carregarProjetosAdmin();

}catch(error){

console.log(error);

alert("Erro ao publicar projeto");

}

}

async function carregarProjetos(){

projectsContainer.innerHTML = "";

try{

const projetosRef =
collection(db,"projetos");

const q =
query(
projetosRef,
orderBy("criadoEm","desc")
);

const querySnapshot =
await getDocs(q);

querySnapshot.forEach((project)=>{

const data = project.data();

const imagens =
data.imagens || [];

projectsContainer.innerHTML += `

<div class="project-card">

<div class="project-gallery">

${imagens.map(img => `

<img src="${img}" alt="${data.titulo}">

`).join('')}

</div>

<div class="project-content">

<h3>${data.titulo}</h3>

<p>${data.descricao}</p>

<a
href="${data.link}"
target="_blank">

Ver Projeto →

</a>

</div>

</div>

`;

});

}catch(error){

console.log(error);

}

}

async function carregarProjetosAdmin(){

adminProjects.innerHTML = "";

try{

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

}catch(error){

console.log(error);

}

}

window.deletarProjeto = async function(id){

const confirmar =
confirm("Deseja excluir este projeto?");

if(!confirmar) return;

try{

await deleteDoc(
doc(db,"projetos",id)
);

await carregarProjetos();

await carregarProjetosAdmin();

}catch(error){

console.log(error);

alert("Erro ao excluir");

}

}

carregarProjetos();
