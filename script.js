const apiUrl = "https://role-based-access-backend-api.onrender.com"
// const apiUrl = "http://127.0.0.1:4000"

const loginForm = document.getElementById("loginForm")
const signupForm = document.getElementById("signupForm")


const logoutUser = document.getElementById("logoutUser")
const logoutAdmin = document.getElementById("logoutAdmin")

const adminTask = document.getElementById("adminTask")
const userTask = document.getElementById("userTask")

const addUserTask = document.getElementById("addUserTask")
const addTaskForm = document.getElementById("addTaskForm")

const back = document.getElementById("back")
const dashboard = document.getElementById("dashboard")

window.addEventListener('pageshow', function (event) {
    // Reload if coming from back/forward cache
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        window.location.reload();
    }
});


function alerMessage(message){
    alert(message)
}

  


if (loginForm) {
    loginForm.addEventListener('submit', loginUser)
}


if (signupForm) {
    signupForm.addEventListener('submit', signupUser)
}


if (logoutUser) {
    console.log(logoutUser)
    logoutUser.addEventListener('click', logout)
}


if (logoutAdmin) {
    console.log(logoutAdmin)
    logoutAdmin.addEventListener('click', logout)
}


if (adminTask) {
    console.log(adminTask)
    fetchAdminTask()
}


if (userTask) {
    fetchUserTask()
}


if (addUserTask) {
    addUserTask.addEventListener('click', addUserTaskFunction)
}


if (addTaskForm) {
    addTaskForm.addEventListener('submit', addTask)
}


if (back) {
    back.addEventListener("click", refreshCurrentPage)
}


if (dashboard) {
    dashboard.addEventListener("click", refreshCurrentPage)
}


async function loginUser(e) {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    // console.log(email)
    // console.log(password)

    const data = {
        email: email,
        password: password
    }

    try {
        const res = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            credentials: "include",

            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        console.log(res)


        if (res.ok) {
            const result = await res.json();
            console.log('Login successful:', result);
            // console.log(result.token)
            // const allcookies = document.cookie
            // console.log(allcookies)

            if (result.role === "user") {
                window.location.href = 'userDashboard.html';
            } else if (result.role === "admin") {
                window.location.href = "adminDashboard.html";
            }
        } else {
            const errorData = await res.json();
            console.log(errorData)
            // console.log(errorData.message)
            // console.log(res.status)
            const errorContainer = document.getElementById("error")
            errorContainer.style.display = "block"
            errorContainer.innerHTML = errorData.message
        }

    } catch (error) {
        console.error('Error:', error);
    }
}


async function signupUser(e) {
    e.preventDefault()
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    // console.log(name)
    // console.log(email)
    // console.log(password)

    const userInfo = {
        name: name,
        email: email,
        password: password
    }

    try {
        const res = await fetch(`${apiUrl}/api/auth/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        })

        if (res.ok) {
            const data = await res.json()
            console.log("User registered succefull")
            console.log(data)
            console.log(data.message)
            window.location.href = 'index.html'
        } else {
            const err = await res.json()
            console.log(err)
            const errorEle = document.getElementById("error")
            errorEle.style.display = "block"
            errorEle.innerHTML = err.message
        }

    } catch (error) {
        console.log(error.message)
    }
}

async function logout() {
    const res = await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    })


    if (res.ok) {
        const data = await res.json()
        alert(data.message)
        window.location.href = "index.html"
    }else{
        window.location.href = "index.html"
    }
}


async function fetchAdminTask() {

    console.log("apiUrl is:", apiUrl);
    try {
        console.log("About to fetch...");

        const res = await fetch(`${apiUrl}/api/task/admin/dashboard`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        console.log(res)
        if (res.ok) {
            let data = await res.json()
            console.log(data)
            const body = document.querySelector('body')
            body.style.display = "flex"
            if (data.allTask.length > 0) {
                const h1 = document.querySelector('h1')
                h1.innerHTML = `Welcome ${data.name.toUpperCase()}`
                data.allTask.forEach((tasks) => {
                    
                    displayAdminTask(tasks)
                })
            }else{
                const h1 = document.querySelector('h1')
                h1.innerHTML = "No any Task is added by any users"
            }

            // if(data.allTask.length > 0){
            //     const h1 = document.querySelector('h1')
            //     h1.innerHTML = `Welcome ${data.name.toUpperCase()}`
            //     data.allTask.forEach((ele) => {
            //         console.log(ele.title)
            //         console.log(ele.description)
            //         console.log(ele.createdBy)
            //         displayAdminTask(ele)
            //     })
            // }else{
            //     const h1 = document.querySelector('h1')
            //     h1.innerHTML = "No any Task is added by any users"
            // }
        } else {
            const data = await res.json()
            console.log(data)
            // console.log(res.status)
            // console.log(data.message)

            // alert message was not showing before so for that I have to refresh the current page and then it will show me this alert message
            if(res.status === 403){
                refreshCurrentPage()
                alert(data.message)
                // window.location.href = "userDashboard.html"
                window.history.back()
            }else{
                refreshCurrentPage()
                alert(data.message)
                // window.location.href = "index.html"
                window.history.back()
            }

        }

    } catch (error) {
        console.log(error)
    }

}


function displayAdminTask(data) {


    let newDiv = document.createElement('div')

    const container = document.createElement('div')

    container.style.cssText = `

        border: 2px solid red;

    `

    let h2 = document.createElement('h2')

    h2.innerHTML = `Created By :- ${data.name.toUpperCase()}`
    newDiv.appendChild(h2)
    if (data.userTasks.length > 0) {
        console.log(data.userTasks.length)
        data.userTasks.forEach((task, index) => {
            let taskDiv = document.createElement('div')
            let h3 = document.createElement('h2')
            let p = document.createElement('p');
            let p1 = document.createElement('p');
            h3.innerHTML = `Task:- ${index + 1}`
            p.innerHTML = `Title :- ${task.title}`
            p1.innerHTML = `Description :- ${task.description}`
            taskDiv.appendChild(h3)
            taskDiv.appendChild(p)
            taskDiv.appendChild(p1)

            newDiv.appendChild(taskDiv)
        })
    } else {
        let h3 = document.createElement('h2')
        h3.innerHTML = "No task added or created by the user"
        newDiv.appendChild(h3)

    }

    adminTask.appendChild(newDiv)
}


async function fetchUserTask() {
    try {

        const res = await fetch(`${apiUrl}/api/task/user/dashboard`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        console.log(res)

        if (res.ok) {
            let data = await res.json()
            console.log(data)
            const h1 = document.querySelector('#welcome')
            const body = document.querySelector('body')
            body.style.display = "flex"
            if (data.allTask.length > 0) {

                h1.innerHTML = `Welcome ${data.name.toUpperCase()} `
                data.allTask.forEach((ele, index) => displayUserPost(ele, index))
            } else {
                const h1 = document.querySelector('h1')
                h1.innerHTML = "No task available"
            }
        } else {
            const data = await res.json()
            console.log(data)
            // alert message was not showing before, so for that I have to refresh the current page and then it will show me this alert message
            if(res.status === 403){
                refreshCurrentPage()
                alert(data.message)
                // window.location.href = "adminDashboard.html"
                window.history.back()
            }else{
                refreshCurrentPage()
                alert(data.message)
                // window.location.href = "index.html"
                window.history.back()
            }
        }
    } catch (error) {
        console.log(error)
    }

}


function displayUserPost(data, index) {

    let newDiv = document.createElement('div')
    let h2 = document.createElement('h2')
    let p = document.createElement('p');
    let p1 = document.createElement('p');
    h2.innerHTML = `Task :- ${index + 1}`
    p.innerHTML = `Title : - ${data.title}`
    p1.innerHTML = `Description :- ${data.description}`
    newDiv.appendChild(h2)
    newDiv.appendChild(p)
    newDiv.appendChild(p1)

    userTask.appendChild(newDiv)
}


function refreshCurrentPage() {
    location.reload()
}


function addUserTaskFunction() {
    const addTaskEle = document.getElementById("addTask")
    const h1 = document.querySelector('#welcome')

    addTaskEle.style.display = "flex"
    userTask.style.display = "none"
    h1.style.display = "none"
}


async function addTask(e) {
    e.preventDefault()
    const title = document.getElementById("taskTitle").value
    const description = document.getElementById("taskDescription").value
    const data = {
        title: title,
        description: description
    }

    console.log(title)
    console.log(description)
    try {
        const res = await fetch(`${apiUrl}/api/task/addUserTask`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(data)
        })
        console.log(res)

        if (res.ok) {
            const finalData = await res.json()
            console.log("Task Created succefull")
            console.log(finalData)
            console.log(finalData.message)
            const successEle = document.getElementById("success")
            successEle.style.display = "block"
            successEle.innerHTML = finalData.message

        } else if (res.status === 401) {
            console.log(res.status)
            const err = await res.json()
            alert(err.message)
            window.location.href = "index.html"
        }else{
            const err = await res.json()
            const errEle = document.getElementById("error1")
            errEle.innerHTML = err.message
        }

    } catch (error) {
        console.log("Error while adding the task : ", error)
    }

}

// function displayAdminTask(data) {
// let newDiv = document.createElement('div')
// const container = document.createElement('div')
// container.style.cssText = `
// border: 2px solid red;
// `
// let h2 = document.createElement('h2')
// let p = document.createElement('p');
// let p1 = document.createElement('p');
// h2.innerHTML = `Created By :- ${data.createdBy.toUpperCase()}`
// p.innerHTML = data.title
// p1.innerHTML = data.description
// newDiv.appendChild(h2)
// newDiv.appendChild(p)
// newDiv.appendChild(p1)
// 
// adminTask.appendChild(newDiv)
// 
// }