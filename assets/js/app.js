const cl = console.log;

const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const userIdControl = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const postForm = document.getElementById("postForm");
const cardContainer = document.getElementById("cardContainer");
const loader = document.getElementById("loader");

const baseUrl =`https://fetch-async-await-6ee8c-default-rtdb.asia-southeast1.firebasedatabase.app/`;

const postUrl = `${baseUrl}/posts.json`;

const hideLoader = () => {
    loader.classList.add("d-none");
}

const onDelete = async (ele) => {
    Swal.fire({
        title: "Are you sure you want to delete it?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                let deleteId = ele.closest(".card").id;
                let deleteUrl = `${baseUrl}/posts/${deleteId}.json`;
                let res = await makeApiCall("DELETE", deleteUrl);
                ele.closest(".card").remove();
            } catch (err) {
             cl(err)   
            }finally{
                hideLoader();
            }
          Swal.fire({
            title: "Post is deleted Successfully!!!",
            icon: "success",
            timer: 3000
          });
        }
      });
    
    }


    const onEdit = async (ele) => {
        try {
            let editId = ele.closest(".card").id;
            let editUrl = `${baseUrl}/posts/${editId}.json`;
            localStorage.setItem("editId",editId);
            let res = await  makeApiCall("GET", editUrl);
            titleControl.value = res.title;
            contentControl.value = res.body;
            userIdControl.value = res.userId;
            submitBtn.classList.add("d-none");
            updateBtn.classList.remove("d-none");
        } catch (err) {
         cl(err)   
        }finally{
            hideLoader();
        }
    }


const templatingOfCard = (arr) => {
    cardContainer.innerHTML = arr.map(obj => {
        return `
                    <div class="card mb-4" id="${obj.id}">
                            <div class="card-header">
                                <h4 class="m-0">${obj.title}</h4>
                            </div>
                            <div class="card-body">
                                <p class="m-0">${obj.body}</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                            <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                            </div>
                     </div>

               `
    }).join("")
}

const insertCard = (obj) => {
    let card = document.createElement("div");
    card.className = "card mb-4";
    card.id = obj.id;
    card.innerHTML = `
                        <div class="card-header">
                        <h4 class="m-0">${obj.title}</h4>
                        </div>
                        <div class="card-body">
                            <p class="m-0">${obj.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                            <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                        </div>
                              `
                              cardContainer.append(card);
}

const makeApiCall = async (methodName, apiUrl, msgBody) => {
    msgInfo = msgBody ? JSON.stringify(msgBody) : null;
    let res = await fetch(apiUrl,{
        method : methodName,
        body : msgInfo
    })
    return res.json();
}

const fetchAll = async () => {
    let res = await makeApiCall("GET", postUrl)
    //cl(res)
    templatingofCard(res)
}
fetchAll()


// const fetchAll = async () => {
//     let res = await makeApiCall("GET", postUrl)
//     let postArr = [];
//     for(let key in res){
//       let obj = {...res[key],id:key};
//        cl(obj);
//        postArr.push(obj);
//     }
//     templatingOfCard(postArr);
//  }

const onPostSubmit = async (eve) => {
    eve.preventDefault()
    try {
        let newPost = {
            title : titleControl.value,
            body : contentControl.value,
            userId : userIdControl.value
        }
        //cl(newPost)
        let res = await makeApiCall("POST", postUrl, newPost);
        //newPost.id = res.id;
        insertCard(newPost);
        Swal.fire({
            title: "Post is submitted succesfully!",
            icon: "success",
            timer : 3000
          });
    } catch (err) {
        cl(err)
    }finally{
        hideLoader();
        // postForm.reset();
    }  
}


const onPostUpdate = async () => {
    try {
        let updatedObj = {
            title : titleControl.value,
            body : contentControl.value,
            userId : userIdControl.value
        }
        cl(updatedObj)
        let updateId = localStorage.getItem("editId");
        let updateUrl = `${baseUrl}/posts/${updateId}.json`;
        let res = await makeApiCall("PATCH", updateUrl, updatedObj);
        updatedObj.id = updateId;
        let card = [...document.getElementById(updatedObj.id).children];
        card[0].innerHTML = `<h4 class="m-0">${updatedObj.title}</h4>`;
        card[1].innerHTML = `<p class="m-0">${updatedObj.body}</p>`;
        Swal.fire({
            title: "Post is updated succesfully!",
            icon: "success",
            timer : 3000
          });
    } catch (err) {
        cl(err)
    }finally{
        hideLoader();
        //loader.classList.add("d-none");
        postForm.reset();
        submitBtn.classList.remove("d-none");
        updateBtn.classList.add("d-none");
    }  
}


postForm.addEventListener("submit", onPostSubmit);
updateBtn.addEventListener("click", onPostUpdate);