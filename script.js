const apiUrl = "https://role-based-authentication-api.onrender.com"
// login

const loginForm = document.getElementById("loginForm")
if (loginForm) {
    loginForm.addEventListener('submit', loginUser)
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
        // console.log(res)


        if (res.ok) {
            const result = await res.json(); // Parse JSON response
            console.log('Login successful:', result);
            // console.log(result.accessToken)
            // const allcookies = document.cookie
            // console.log(res.status())

            if (result.role === "user") {
                // cookies.set('accessToken', result.accessToken)
                // window.location.href = 'adminDashboard.html';
                // window.history.pushState({}, "", "adminDashboard.html");

                
                window.location.href = 'userDashboard.html';
            } else {
                window.location.assign("adminDashboard.html");
            }

            // Redirect or handle success
            // window.location.href = 'dashboard.html'; // Redirect after login
        } else {
            // Handle error response
            const errorData = await res.json();
            console.log(errorData.message)
            const errorContainer = document.getElementById("error")
            errorContainer.style.display = "flex"
            errorContainer.style.color = "red"
            errorContainer.innerHTML = errorData.message
            console.log(res.status)
            // console.error('Login failed:', errorData.detail);
            // alert('Login failed: ' + errorData.detail);
        }

    } catch (error) {
        console.error('Error:', error);
        // alert('Something went wrong. Please try again.');
    }
}


const signupForm = document.getElementById("signupForm")

if (signupForm) {
    signupForm.addEventListener('submit', signupUser)
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
            console.log(err.message)
        }

    } catch (error) {
        console.log(error.message)
    }
}

const adminTask = document.getElementById("adminTask")
const userTask = document.getElementById("userTask")

// console.log(userTask)
const fetchAdminTask = async () => {
    try {
        const res = await fetch(`${apiUrl}/api/task/admin/dashboard`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })

        if (res.ok) {
            let data = await res.json()
            console.log(data)
            if(data.allTask.length > 0){
                const h1 = document.querySelector('h1')
                h1.innerHTML = `Welcome ${data.name.toUpperCase()}`
                data.allTask.forEach((ele) => {
                    console.log(ele.title)
                    console.log(ele.description)
                    console.log(ele.createdBy)
                    displayAdminTask(ele)
                })
            }else{
                const h1 = document.querySelector('h1')
                h1.innerHTML = "No any Task is added by any users"
            }
            // data.allTask.forEach(ele => console.log(ele.title))
        }else{
            const data = await res.json()
            console.log("User registered succefull")
            console.log(data)
            console.log(data.message)
            window.location.href = 'index.html'
        }
    } catch (error) {
        console.log(error)
    }

}


const fetchUserTask = async () => {
    try {
        const res = await fetch(`${apiUrl}/api/task/user/dashboard`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })

        if (res.ok) {
            let data = await res.json()
            console.log(data)
            const h1 = document.querySelector('#welcome')
            if(data.allTask.length > 0){

                
                h1.innerHTML = `Welcome ${data.name.toUpperCase()} `
                data.allTask.forEach((ele, index) => displayUserPost(ele, index))
            }else{
                // const h1 = document.querySelector('h1')
                h1.innerHTML = "No task available"
            }
            // data.allTask.forEach(ele => console.log(ele.title))
        }else{
            const data = await res.json()
            console.log(data)
            console.log(data.message)
            window.location.href = 'index.html'
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
    p.innerHTML = data.title
    p1.innerHTML = data.description
    newDiv.appendChild(h2)
    newDiv.appendChild(p)
    newDiv.appendChild(p1)

    userTask.appendChild(newDiv)
}


function displayAdminTask(data){
    let newDiv = document.createElement('div')
    const container = document.createElement('div')
    container.style.cssText = `
        border: 2px solid red;
    `
    let h2 = document.createElement('h2')
    let p = document.createElement('p');
    let p1 = document.createElement('p');
    h2.innerHTML = `Created By :- ${data.createdBy.toUpperCase()}`
    p.innerHTML = data.title
    p1.innerHTML = data.description
    newDiv.appendChild(h2)
    newDiv.appendChild(p)
    newDiv.appendChild(p1)

    adminTask.appendChild(newDiv)
    
}

if (adminTask) {
    console.log(adminTask)
    fetchAdminTask()
}

if(userTask){
    fetchUserTask()
}

const addUserTask = document.getElementById("addUserTask")
const addTaskForm = document.getElementById("addTaskForm")

const back = document.getElementById("back")
const dashboard = document.getElementById("dashboard")

if(dashboard){
    dashboard.addEventListener("click", () => {
        const addTaskEle = document.getElementById("addTask")
        const h1 = document.querySelector('#welcome')

        addTaskEle.style.display = "none"
        userTask.style.display = "flex"
        h1.style.display = "block"
    })
}

if(back){
    back.addEventListener("click", () => {
        const addTaskEle = document.getElementById("addTask")

        addTaskEle.style.display = "none"
        userTask.style.display = "flex"
    })
}



if(addUserTask){
    addUserTask.addEventListener('click', () => {
        const addTaskEle = document.getElementById("addTask")
        const h1 = document.querySelector('#welcome')

        addTaskEle.style.display = "flex"
        userTask.style.display = "none"
        h1.style.display = "none"

    })
}
if(addTaskForm){
    addTaskForm.addEventListener('submit', addTask)
}

async function addTask(e){
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
    
        if (res.ok){
            const finalData = await res.json()
            console.log("Task Created succefull")
            console.log(data)
            console.log(data.message)
            
        }else{
            if(res.status === 401){
                console.log(res.status)
                alert("User is Unauthorized Please login Again")
                window.location.href = "index.html"
            }

        }
    } catch (error) {
        // const err = await res.json()
        console.log("Error while adding the task : ", error)



    }

}

const logoutUser = document.getElementById("logoutUser")
const logoutAdmin = document.getElementById("logoutAdmin")
if(logoutUser){
    console.log(logoutUser)
    logoutUser.addEventListener('click', logout)
}

if(logoutAdmin){
    console.log(logoutAdmin)
    logoutAdmin.addEventListener('click', logout)
}

async function logout(){
    const req = await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    })

    const res = await req.json()
    console.log(res)
    if(req.ok){
        window.location.href = "index.html"
    }

}