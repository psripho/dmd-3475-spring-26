fetch('https://api.thecatapi.com/v1/images/search?limit=5')
  .then(res => res.json())
  .then(data => {
    const catImages = data.map(cat => cat.url);

    let index = 0;

    document.body.style.backgroundImage = `url(${catImages[index]})`;

    setInterval(() => {
      index = (index + 1) % catImages.length;
      document.body.style.backgroundImage = `url(${catImages[index]})`;
    }, 5000);
  });

  let index = 0;
let showingFirst = true;

const bg1 = document.querySelector('.bg1');
const bg2 = document.querySelector('.bg2');

fetch('https://api.thecatapi.com/v1/images/search?limit=10')
  .then(res => res.json())
  .then(data => {
    const catImages = data.map(cat => cat.url);

    bg1.style.backgroundImage = `url(${catImages[0]})`;

    setInterval(() => {
      index = (index + 1) % catImages.length;

      if (showingFirst) {
        bg2.style.backgroundImage = `url(${catImages[index]})`;
        bg2.style.opacity = 1;
        bg1.style.opacity = 0;
      } else {
        bg1.style.backgroundImage = `url(${catImages[index]})`;
        bg1.style.opacity = 1;
        bg2.style.opacity = 0;
      }

      showingFirst = !showingFirst;
    }, 4000); // adjust timing if you want
  });
// moods
const moods = [
    {
      name: "happy",
      color: "#eec858",
      gif: "gif/happy.gif",
      playlistId: "1y6u9y93V0WvRuO4cr1hwI"
    },
    {
      name: "sad",
      color: "#759aab",
      gif: "gif/clouds.gif",
      playlistId: "1TV2zsSMN9Xc93hNQITyGM"
    },
    {
      name: "late",
       color: "#331832",
      gif: "gif/moon.gif",
      playlistId: "3jgf1f9dzZKWq4y41xB9H0"
    },
    {
      name: "angry",
      color: "#e70e02",
      gif: "gif/mosh.gif",
      playlistId: "1y7JRH2gJyPSXQYkyrgS2P"
    }
  ];
  
  // element selectors
  const moodInputs = document.querySelectorAll('#mood-select input[name="mood"]');
  const iframe = document.getElementById("embed-iframe");
  const background = document.getElementById("background");
  
  // mood function
  function changeMood(moodName) {
    const mood = moods.find(m => m.name === moodName);
    if (!mood) return;
  
    // spotify api
    iframe.src = `https://open.spotify.com/embed/playlist/${mood.playlistId}`;
  

    //color overlay
      const overlay = document.getElementById("color-overlay");
      overlay.style.background = mood.color || "rgba(247, 235, 232, 0.2)";

    // gif
    const gif = document.getElementById("overlay-gif");
    if (mood.gif) {
      gif.src = mood.gif;
    } else {
      gif.src = ""; 
    }
  }
  
  // event
  moodInputs.forEach(input => {
    input.addEventListener("change", () => {
      changeMood(input.value);
    });
  });



   let tasks = [];
  let filter = "all"; // all, active, completed
  
  // Display tasks
  function displayTasks() {
    let list = document.getElementById("list");
    list.innerHTML = "";
  
    let filteredTasks = tasks.filter(task => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    });
  
    filteredTasks.forEach((task, index) => {
      let li = document.createElement("li");
  
      if (task.completed) {
        li.classList.add("checked");
      }
  
      li.innerHTML = `
        <span onclick="toggleComplete(${index})">${task.text}</span>
        <small>${new Date(task.createdAt).toLocaleString()}</small>
        <button onclick="editTask(${index})">edit</button>
        <button onclick="removeTask(${index})"> x </button>
      `;
  
      list.appendChild(li);
    });
  }
  
  // Add task
  function addTask() {
    let taskInput = document.getElementById("task");
    let text = taskInput.value.trim();

    function addTask() {
      let taskInput = document.getElementById("task");
      let text = taskInput.value.trim();
    
      if (text === "") return;
    
      tasks.push({
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
      });
    
      taskInput.value = "";
      saveTasks();
      displayTasks();
    }

    const input = document.getElementById("task");

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });
  
    tasks.push({
      text: text,
      completed: false,
      createdAt: new Date().toISOString()
    });
  
    taskInput.value = "";
    saveTasks();
    displayTasks();
  }
  
  // Remove task
  function removeTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
  }
  
  // Edit task
  function editTask(index) {
    let newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
      tasks[index].text = newText;
      saveTasks();
      displayTasks();
    }
  }
  
  // Toggle task completion
  function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks();
  }
  
  // Clear all tasks
  function clearAll() {
    tasks = [];
    saveTasks();
    displayTasks();
  }
  
  // Set filter
  function setFilter(type) {
    filter = type;
    displayTasks();
  }

    function setFilter(type) {
    filter = type;
    displayTasks();
  
    const filterButtons = document.querySelectorAll(".controls button");
    filterButtons.forEach(button => button.classList.remove("filter-active"));
  
    const activeButton = Array.from(filterButtons).find(button => button.textContent.toLowerCase() === type);
    if (activeButton) {
      activeButton.classList.add("filter-active");
    }
  }
  
  // Sort tasks
  function sortTasks(type) {
    if (type === "newest") {
      tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (type === "oldest") {
      tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (type === "alphabetical") {
      tasks.sort((a, b) => a.text.localeCompare(b.text));
    }
  
    displayTasks();
  }
  
  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  
  // Load tasks from localStorage
  function loadTasks() {
    let saved = localStorage.getItem("tasks");
    if (saved !== null) {
      tasks = JSON.parse(saved);
    }
  }
  
  // Initialize
  loadTasks();
  displayTasks();