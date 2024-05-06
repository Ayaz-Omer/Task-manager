document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
});

function openModal(id) {
    document.getElementById(id).style.display = "block";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

function addTask() {
    if (!checkLoggedIn()) {
        alert("Please log in to add tasks");
        return;
    }

    var input = document.getElementById("taskInput").value;
    if (input === '') {
        alert("Please enter a task!");
        return;
    }

    var task = {
        id: Date.now(),
        text: input,
        completed: false
    };

    addTaskToDOM(task);
    saveTask(task);

    document.getElementById("taskInput").value = '';
}

function addTaskToDOM(task) {
    var ul = document.getElementById("taskList");
    var li = document.createElement("li");
    li.setAttribute("id", task.id);
    li.classList.add("task-entry");
    li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <div class="task-actions">
            <button onclick="deleteTask(${task.id})">Delete</button>
            <button onclick="toggleComplete(${task.id})">Complete</button>
            <button onclick="editTask(${task.id})">Edit</button>
        </div>
    `;
    ul.appendChild(li);
    animateTaskEntry(li);
}

function deleteTask(id) {
    var li = document.getElementById(id);
    animateTaskExit(li, function() {
        li.remove();
        removeTaskFromStorage(id);
    });
}

function toggleComplete(id) {
    var li = document.getElementById(id);
    li.classList.toggle("completed");
    updateTaskInStorage(id);
}

function editTask(id) {
    var newText = prompt("Edit task:");
    if (newText === null || newText.trim() === '') {
        return;
    }

    var li = document.getElementById(id);
    li.querySelector(".task-text").textContent = newText;
    updateTaskInStorage(id);
}

function clearTasks() {
    var ul = document.getElementById("taskList");
    var tasks = Array.from(ul.children);
    tasks.forEach(task => {
        animateTaskExit(task, function() {
            task.remove();
        });
    });
    localStorage.removeItem("tasks");
}

function saveTask(task) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

function updateTaskInStorage(id) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    var taskIndex = tasks.findIndex(task => task.id === id);
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTaskFromStorage(id) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    var updatedTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function checkLoggedIn() {
    return localStorage.getItem("loggedIn") === "true";
}

function animateTaskEntry(element) {
    gsap.from(element, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.out"
    });
}

function animateTaskExit(element, callback) {
    gsap.to(element, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in",
        onComplete: callback
    });
}

function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var savedUsername = localStorage.getItem("username");
    var savedPassword = localStorage.getItem("password");

    if (username === savedUsername && password === savedPassword) {
        localStorage.setItem("loggedIn", "true");
        document.getElementById("loginForm").reset();
        document.getElementById("loginModal").style.display = "none";
        loadTasks(); // Load tasks after successful login
    } else {
        alert("Invalid username or password");
    }
}

function signup() {
    var username = document.getElementById("newUsername").value;
    var password = document.getElementById("newPassword").value;

    if (username === '' || password === '') {
        alert("Please enter a username and password");
        return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    localStorage.setItem("loggedIn", "true");
    document.getElementById("signupForm").reset();
    document.getElementById("signupModal").style.display = "none";
    loadTasks();
}



