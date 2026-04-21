const windows = document.querySelectorAll(".window");
const desktopShortcuts = document.querySelectorAll(".desktop-shortcut");
const taskButtons = document.querySelectorAll(".task-icon");
const closeButtons = document.querySelectorAll(".close-btn");
const minimizeButtons = document.querySelectorAll(".minimize-btn");
const maxButtons = document.querySelectorAll(".max-btn");

const bootScreen = document.getElementById("bootScreen");
const loginScreen = document.getElementById("loginScreen");
const desktop = document.getElementById("desktop");
const signInBtn = document.getElementById("signInBtn");

const startBtn = document.getElementById("startBtn");
const startMenu = document.getElementById("startMenu");
const startSearch = document.getElementById("startSearch");
const startItems = document.querySelectorAll(".start-item");
const signOutBtn = document.getElementById("signOutBtn");

const notifToggle = document.getElementById("notifToggle");
const notificationPanel = document.getElementById("notificationPanel");
const notificationList = document.getElementById("notificationList");
const clearNotifications = document.getElementById("clearNotifications");

const terminalOutput = document.getElementById("terminalOutput");
const clockBottom = document.getElementById("clockBottom");

const soundToggle = document.getElementById("soundToggle");
const glassRange = document.getElementById("glassRange");
const wallpaperButtons = document.querySelectorAll(".wallpaper-option");

const projectGrid = document.getElementById("projectGrid");
const projectDetails = document.getElementById("projectDetails");
const closeProjectDetails = document.getElementById("closeProjectDetails");
const projectExtraCard = document.getElementById("projectExtraCard");

const projectTitle = document.getElementById("projectTitle");
const projectDescription = document.getElementById("projectDescription");
const projectDemoLabel = document.getElementById("projectDemoLabel");
const projectDemoText = document.getElementById("projectDemoText");
const projectDemoBtn = document.getElementById("projectDemoBtn");
const projectSourceLabel = document.getElementById("projectSourceLabel");
const projectSourceText = document.getElementById("projectSourceText");
const projectSourceBtn = document.getElementById("projectSourceBtn");
const projectDemoIcon = document.getElementById("projectDemoIcon");
const projectSourceIcon = document.getElementById("projectSourceIcon");

const chromeFrame = document.getElementById("chromeFrame");
const chromeHome = document.getElementById("chromeHome");
const chromeViewer = document.getElementById("chromeViewer");
const chromeGithub = document.getElementById("chromeGithub");
const chromeAddress = document.getElementById("chromeAddress");
const chromeGo = document.getElementById("chromeGo");
const chromeBack = document.getElementById("chromeBack");
const chromeForward = document.getElementById("chromeForward");
const chromeRefresh = document.getElementById("chromeRefresh");
const chromeTabText = document.getElementById("chromeTabText");

const homeCards = document.querySelectorAll(".home-card");
const installButtons = document.querySelectorAll(".install-btn");

const cpuStat = document.getElementById("cpuStat");
const ramStat = document.getElementById("ramStat");
const nodeStat = document.getElementById("nodeStat");
const uptimeStat = document.getElementById("uptimeStat");
const mcCount = document.getElementById("mcCount");
const rustCount = document.getElementById("rustCount");

const SETTINGS_KEYS = {
  wallpaper: "deweyos_wallpaper",
  sound: "deweyos_sound",
  taskbarOpacity: "deweyos_taskbar_opacity",
  desktopIcons: "deweyos_desktop_icons"
};

let soundEnabled = true;
let currentProject = null;
let fakeHistory = ["home://welcome"];
let fakeHistoryIndex = 0;
let currentGithubRepo = "deweyos";

const githubRepoData = {
  deweyos: {
    repoName: "Dewey / DeweyOS",
    branch: "main",
    files: ["📄 index.html", "🎨 style.css", "⚡ script.js", "📁 Imgs"],
    readmeTitle: "README.md",
    readmeText:
      "DeweyOS desktop portfolio operating system UI. Includes draggable windows, taskbar, file explorer, Chrome clone, and app launcher."
  },
  media: {
    repoName: "Dewey / Deweys Media",
    branch: "main",
    files: ["📄 app.py", "🎨 style.css", "⚡ main.js", "📁 templates", "📁 static"],
    readmeTitle: "README.md",
    readmeText:
      "Deweys Media is a social media platform built with Python and Flask, including feeds, user accounts, posts, and moderation tools."
  },
  hosting: {
    repoName: "Dewey / Deweys Hosting",
    branch: "private",
    files: ["🔒 Repository contents hidden"],
    readmeTitle: "PRIVATE_REPO.md",
    readmeText:
      "This source code is private during active development. Public preview only."
  }
};

const projectData = {
  deweyos: {
    title: "DeweyOS Portfolio",
    description: "Desktop-style portfolio with draggable windows and OS UI.",
    demoLabel: "Current Session",
    demoText: "You are currently viewing DeweyOS live in the browser.",
    demoButton: "Open",
    sourceLabel: "Source Code",
    sourceText: "Open the portfolio source repository.",
    sourceButton: "Source Code",
    demoIcon: "🖥️",
    sourceIcon: "💻",
    extra: `
      <h3>Project Status</h3>
      <p class="muted">Live portfolio environment loaded successfully.</p>
    `,
    demoAction: () => {
      addNotification("DeweyOS", "You are already inside the live DeweyOS session.");
      openWindow("aboutWindow");
    },
    sourceAction: () => {
      openGithubPage("deweyos");
    }
  },
  media: {
    title: "Deweys Media",
    description: "Full scale social media platform made with Python and Flask.",
    demoLabel: "Live Demo",
    demoText: "Open the live social media platform preview.",
    demoButton: "Demo",
    sourceLabel: "Source Code",
    sourceText: "Open the GitHub repository for Deweys Media.",
    sourceButton: "Source Code",
    demoIcon: "🌐",
    sourceIcon: "💻",
    extra: `
      <h3>Platform Stack</h3>
      <p class="muted">Python, Flask, user accounts, posts, feeds, and moderation tools.</p>
    `,
    demoAction: () => {
      openChromePage("https://deweys-media.deweyshosting.com:8081/");
    },
    sourceAction: () => {
      openGithubPage("media");
    }
  },
  hosting: {
    title: "Deweys Hosting",
    description: "A hosting platform for games like Rust, Minecraft, and more.",
    demoLabel: "Dashboard Preview",
    demoText: "View the hosting platform concept and dashboard preview.",
    demoButton: "Preview",
    sourceLabel: "Private Repository",
    sourceText: "Source code is private during active development.",
    sourceButton: "Private",
    demoIcon: "📊",
    sourceIcon: "🔒",
    extra: `
      <h3>Server Snapshot</h3>
      <p class="muted">3 nodes online • 12 Minecraft servers • 4 Rust servers • 99.9% uptime</p>
    `,
    demoAction: () => {
      openChromePage("https://deweyshosting.com");
      addNotification("Deweys Hosting", "Dashboard preview opened.");
    },
    sourceAction: () => {
      openGithubPage("hosting");
    }
  }
};

function playSound(type = "click") {
  if (!soundEnabled) return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const ctx = new AudioContextClass();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value =
    type === "boot" ? 320 :
    type === "login" ? 520 :
    type === "notify" ? 760 : 620;

  gain.gain.value = 0.03;
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.09);
}

function setClock() {
  const now = new Date();
  clockBottom.textContent = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}
setClock();
setInterval(setClock, 1000);

function saveSettings() {
  localStorage.setItem(SETTINGS_KEYS.sound, JSON.stringify(soundEnabled));
  localStorage.setItem(SETTINGS_KEYS.taskbarOpacity, glassRange.value);

  const activeWallpaperBtn = document.querySelector(".wallpaper-option.active");
  if (activeWallpaperBtn) {
    localStorage.setItem(SETTINGS_KEYS.wallpaper, activeWallpaperBtn.dataset.wallpaper);
  }
}

function loadSettings() {
  const savedWallpaper = localStorage.getItem(SETTINGS_KEYS.wallpaper);
  const savedSound = localStorage.getItem(SETTINGS_KEYS.sound);
  const savedOpacity = localStorage.getItem(SETTINGS_KEYS.taskbarOpacity);

  if (savedWallpaper) {
    document.body.className = savedWallpaper;
    wallpaperButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.wallpaper === savedWallpaper);
    });
  }

  if (savedSound !== null) {
    soundEnabled = JSON.parse(savedSound);
    soundToggle.textContent = soundEnabled ? "On" : "Off";
  }

  if (savedOpacity) {
    glassRange.value = savedOpacity;
    document.documentElement.style.setProperty("--taskbar-opacity", savedOpacity);
  }
}

function saveDesktopIconPositions() {
  const positions = {};

  desktopShortcuts.forEach((icon, index) => {
    const iconKey = icon.dataset.window || `icon-${index}`;
    positions[iconKey] = {
      left: icon.style.left,
      top: icon.style.top
    };
  });

  localStorage.setItem(SETTINGS_KEYS.desktopIcons, JSON.stringify(positions));
}

function loadDesktopIconPositions() {
  const saved = localStorage.getItem(SETTINGS_KEYS.desktopIcons);
  const positions = saved ? JSON.parse(saved) : null;

  const defaultPositions = [
    { left: "0px", top: "0px" },
    { left: "0px", top: "105px" },
    { left: "0px", top: "210px" },
    { left: "0px", top: "315px" },
    { left: "110px", top: "0px" },
    { left: "110px", top: "105px" },
    { left: "110px", top: "210px" },
    { left: "110px", top: "315px" }
  ];

  desktopShortcuts.forEach((icon, index) => {
    const iconKey = icon.dataset.window || `icon-${index}`;

    if (positions && positions[iconKey]) {
      icon.style.left = positions[iconKey].left;
      icon.style.top = positions[iconKey].top;
    } else {
      icon.style.left = defaultPositions[index]?.left || "0px";
      icon.style.top = defaultPositions[index]?.top || `${index * 100}px`;
    }
  });
}

function makeDesktopIconsDraggable() {
  const container = document.getElementById("desktopIcons");
  if (!container) return;

  desktopShortcuts.forEach(icon => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let moved = false;

    icon.addEventListener("mousedown", e => {
      if (e.button !== 0) return;

      isDragging = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      offsetX = e.clientX - icon.offsetLeft;
      offsetY = e.clientY - icon.offsetTop;
      icon.style.zIndex = "20";
    });

    document.addEventListener("mousemove", e => {
      if (!isDragging) return;

      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (dx > 4 || dy > 4) moved = true;

      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;

      const maxLeft = container.clientWidth - icon.offsetWidth;
      const maxTop = container.clientHeight - icon.offsetHeight;

      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      newTop = Math.max(0, Math.min(newTop, maxTop));

      icon.style.left = `${newLeft}px`;
      icon.style.top = `${newTop}px`;
    });

    document.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      icon.style.zIndex = "";
      saveDesktopIconPositions();
    });

    icon.addEventListener("click", e => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });
}

function closeAllWindowsOnLoad() {
  windows.forEach(win => {
    win.classList.add("hidden-window");
    win.style.display = "none";
    win.classList.remove("active");
  });
  updateTaskButtons(null);
}

loadSettings();
loadDesktopIconPositions();
makeDesktopIconsDraggable();
closeAllWindowsOnLoad();

setTimeout(() => {
  bootScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  playSound("boot");
}, 1800);

signInBtn.addEventListener("click", () => {
  loginScreen.classList.add("hidden");
  desktop.classList.remove("hidden");
  closeAllWindowsOnLoad();
  playSound("login");
  bootTerminal();
  addNotification("DeweyOS", "Welcome back, Dewey.");
  addNotification("System", "Portfolio environment loaded.");
});

signOutBtn?.addEventListener("click", () => {
  desktop.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  startMenu.classList.remove("show");
  closeAllWindowsOnLoad();
});

function bootTerminal() {
  const lines = [
    "Initializing DeweyOS Portfolio Edition...",
    "Loading desktop services...",
    "Starting Chrome module...",
    "Mounting Project Explorer...",
    "Server monitor online.",
    "Ready."
  ];

  terminalOutput.innerHTML = "";
  lines.forEach((line, index) => {
    setTimeout(() => {
      const div = document.createElement("div");
      div.className = "terminal-line";
      div.textContent = `> ${line}`;
      terminalOutput.appendChild(div);
    }, index * 300);
  });
}

function bringToFront(targetWindow) {
  windows.forEach(win => win.classList.remove("active"));
  targetWindow.classList.add("active");
}

function updateTaskButtons(activeId) {
  taskButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.window === activeId);
  });
}

function openWindow(windowId) {
  const target = document.getElementById(windowId);
  if (!target) return;

  target.classList.remove("hidden-window");
  target.style.display = "block";
  bringToFront(target);
  updateTaskButtons(windowId);
  playSound("click");
}

function hideWindow(targetWindow) {
  targetWindow.classList.add("hidden-window");
  targetWindow.style.display = "none";
  updateTaskButtons(null);
}

function toggleWindow(windowId) {
  const target = document.getElementById(windowId);
  if (!target) return;

  const isHidden =
    target.classList.contains("hidden-window") ||
    getComputedStyle(target).display === "none";

  if (isHidden) {
    openWindow(windowId);
  } else {
    bringToFront(target);
    updateTaskButtons(windowId);
    playSound("click");
  }
}

desktopShortcuts.forEach(btn => {
  btn.addEventListener("dblclick", () => openWindow(btn.dataset.window));
});

taskButtons.forEach(btn => {
  btn.addEventListener("click", () => toggleWindow(btn.dataset.window));
});

startItems.forEach(item => {
  if (item.id === "signOutBtn") return;
  item.addEventListener("click", () => {
    openWindow(item.dataset.window);
    startMenu.classList.remove("show");
  });
});

startBtn.addEventListener("click", e => {
  e.stopPropagation();
  startMenu.classList.toggle("show");
  playSound("click");
});

document.addEventListener("click", e => {
  if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
    startMenu.classList.remove("show");
  }

  if (!notificationPanel.contains(e.target) && !notifToggle.contains(e.target)) {
    notificationPanel.classList.add("hidden");
  }
});

startSearch.addEventListener("input", () => {
  const value = startSearch.value.toLowerCase().trim();

  startItems.forEach(item => {
    if (item.id === "signOutBtn") return;
    const match = item.textContent.toLowerCase().includes(value);
    item.style.display = match ? "block" : "none";
  });
});

closeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const win = btn.closest(".window");
    hideWindow(win);
    playSound("click");
  });
});

minimizeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const win = btn.closest(".window");
    hideWindow(win);
    playSound("click");
  });
});

maxButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const win = btn.closest(".window");

    if (win.dataset.maximized === "true") {
      win.style.top = win.dataset.prevTop;
      win.style.left = win.dataset.prevLeft;
      win.style.width = win.dataset.prevWidth;
      win.style.height = win.dataset.prevHeight;
      win.dataset.maximized = "false";
    } else {
      win.dataset.prevTop = win.style.top;
      win.dataset.prevLeft = win.style.left;
      win.dataset.prevWidth = win.style.width;
      win.dataset.prevHeight = win.style.height;
      win.style.top = "20px";
      win.style.left = "20px";
      win.style.width = "calc(100vw - 40px)";
      win.style.height = "calc(100vh - 110px)";
      win.dataset.maximized = "true";
    }

    bringToFront(win);
    playSound("click");
  });
});

windows.forEach(makeDraggable);

function makeDraggable(win) {
  const handle = win.querySelector(".drag-handle");
  if (!handle) return;

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  handle.addEventListener("mousedown", e => {
    if (win.dataset.maximized === "true") return;
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    bringToFront(win);
  });

  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    win.style.left = `${e.clientX - offsetX}px`;
    win.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  win.addEventListener("mousedown", () => bringToFront(win));
}

notifToggle.addEventListener("click", e => {
  e.stopPropagation();
  notificationPanel.classList.toggle("hidden");
  playSound("click");
});

clearNotifications.addEventListener("click", () => {
  notificationList.innerHTML = "";
  addNotification("Notifications", "All notifications cleared.");
});

function addNotification(title, text) {
  const card = document.createElement("div");
  card.className = "notification-item";
  card.innerHTML = `<strong>${title}</strong><p>${text}</p>`;
  notificationList.prepend(card);
  playSound("notify");
}

wallpaperButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.body.className = btn.dataset.wallpaper;
    wallpaperButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    saveSettings();
    addNotification("Wallpaper", `${btn.textContent} applied.`);
  });
});

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "On" : "Off";
  saveSettings();
  addNotification("Sound", `System sounds ${soundEnabled ? "enabled" : "disabled"}.`);
});

glassRange.addEventListener("input", () => {
  document.documentElement.style.setProperty("--taskbar-opacity", glassRange.value);
  saveSettings();
});

projectGrid.querySelectorAll(".project-folder-card").forEach(card => {
  card.addEventListener("click", () => {
    const data = projectData[card.dataset.project];
    currentProject = data;

    projectTitle.textContent = data.title;
    projectDescription.textContent = data.description;
    projectDemoLabel.textContent = data.demoLabel;
    projectDemoText.textContent = data.demoText;
    projectDemoBtn.textContent = data.demoButton;
    projectSourceLabel.textContent = data.sourceLabel;
    projectSourceText.textContent = data.sourceText;
    projectSourceBtn.textContent = data.sourceButton;
    projectDemoIcon.textContent = data.demoIcon;
    projectSourceIcon.textContent = data.sourceIcon;
    projectExtraCard.innerHTML = data.extra;
    projectExtraCard.classList.remove("hidden");

    projectGrid.classList.add("hidden");
    projectDetails.classList.remove("hidden");
  });
});

closeProjectDetails.addEventListener("click", () => {
  projectDetails.classList.add("hidden");
  projectGrid.classList.remove("hidden");
});

projectDemoBtn.addEventListener("click", () => {
  if (currentProject?.demoAction) currentProject.demoAction();
});

projectSourceBtn.addEventListener("click", () => {
  if (currentProject?.sourceAction) currentProject.sourceAction();
});

homeCards.forEach(card => {
  card.addEventListener("click", () => {
    if (typeof card.onclick === "function") return;
    openChromePage(card.dataset.openUrl);
  });
});

installButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    openWindow(btn.dataset.window);
  });
});

function renderGithubPage(repoKey = "deweyos") {
  if (!chromeGithub) return;

  const repo = githubRepoData[repoKey] || githubRepoData.deweyos;
  currentGithubRepo = repoKey;

  chromeGithub.innerHTML = `
    <div class="github-page">
      <div class="github-topbar">
        <h2>${repo.repoName}</h2>
        <p>${repo.branch} branch</p>
      </div>

      <div class="github-files">
        ${repo.files.map(file => `<div class="github-file">${file}</div>`).join("")}
      </div>

      <div class="github-readme">
        <h3>${repo.readmeTitle}</h3>
        <p>${repo.readmeText}</p>
      </div>
    </div>
  `;
}

function showChromeHome() {
  chromeHome.classList.remove("hidden");
  chromeHome.classList.add("active");

  chromeViewer.classList.add("hidden");
  chromeViewer.classList.remove("active");

  if (chromeGithub) {
    chromeGithub.classList.add("hidden");
    chromeGithub.classList.remove("active");
  }
}

function showChromeViewer() {
  chromeHome.classList.add("hidden");
  chromeHome.classList.remove("active");

  chromeViewer.classList.remove("hidden");
  chromeViewer.classList.add("active");

  if (chromeGithub) {
    chromeGithub.classList.add("hidden");
    chromeGithub.classList.remove("active");
  }
}

function showChromeGithub() {
  chromeHome.classList.add("hidden");
  chromeHome.classList.remove("active");

  chromeViewer.classList.add("hidden");
  chromeViewer.classList.remove("active");

  if (chromeGithub) {
    chromeGithub.classList.remove("hidden");
    chromeGithub.classList.add("active");
  }
}

function openChromePage(url) {
  openWindow("chromeWindow");
  showChromeViewer();

  chromeAddress.value = url;
  chromeTabText.textContent = getTabText(url);

  fakeHistory = fakeHistory.slice(0, fakeHistoryIndex + 1);
  fakeHistory.push(url);
  fakeHistoryIndex = fakeHistory.length - 1;

  if (url.startsWith("home://")) {
    chromeFrame.srcdoc = getInternalChromePage(url);
  } else {
    chromeFrame.removeAttribute("srcdoc");
    chromeFrame.src = normalizeUrl(url);
  }
}

function openGithubPage(repoKey = "deweyos") {
  openWindow("chromeWindow");
  renderGithubPage(repoKey);
  showChromeGithub();

  const addressValue =
    repoKey === "deweyos" ? "github://deweyos" :
    repoKey === "media" ? "github://media" :
    "github://hosting-private";

  chromeAddress.value = addressValue;
  chromeTabText.textContent =
    repoKey === "deweyos" ? "DeweyOS Repo" :
    repoKey === "media" ? "Deweys Media Repo" :
    "Private Repo";

  fakeHistory = fakeHistory.slice(0, fakeHistoryIndex + 1);
  fakeHistory.push(addressValue);
  fakeHistoryIndex = fakeHistory.length - 1;
}

function normalizeUrl(url) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

function getTabText(url) {
  if (url === "home://welcome") return "New Tab";
  if (url === "home://403-private") return "Private Repo";
  if (url === "home://media-demo") return "Deweys Media";
  if (url === "home://system") return "System Page";
  if (url === "github://deweyos") return "DeweyOS Repo";
  if (url === "github://media") return "Deweys Media Repo";
  if (url === "github://hosting-private") return "Private Repo";
  if (url.includes("github")) return "GitHub";
  if (url.includes("iheart")) return "iHeart";
  if (url.includes("deweyshosting")) return "Deweys Hosting";
  if (url.includes("deweys-media")) return "Deweys Media";
  return "New Tab";
}

function getInternalChromePage(url) {
  if (url === "home://403-private") {
    return `
      <html>
      <body style="margin:0;font-family:Arial;background:#0c1220;color:white;display:grid;place-items:center;height:100vh;">
        <div style="max-width:600px;padding:32px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:24px;">
          <h1>403 — Private Repository</h1>
          <p>This source code is restricted to internal development use and is not publicly available.</p>
        </div>
      </body>
      </html>
    `;
  }

  if (url === "home://media-demo") {
    return `
      <html>
      <body style="margin:0;font-family:Arial;background:#0d1322;color:white;padding:32px;">
        <h1>Deweys Media</h1>
        <p>Public preview page for the social platform.</p>
        <div style="display:grid;gap:14px;grid-template-columns:repeat(3,1fr);margin-top:20px;">
          <div style="padding:20px;border-radius:20px;background:rgba(255,255,255,0.07);">Feed UI</div>
          <div style="padding:20px;border-radius:20px;background:rgba(255,255,255,0.07);">Profiles</div>
          <div style="padding:20px;border-radius:20px;background:rgba(255,255,255,0.07);">Comments</div>
        </div>
      </body>
      </html>
    `;
  }

  if (url === "home://system") {
    return `
      <html>
      <body style="margin:0;font-family:Arial;background:#0a1020;color:white;padding:32px;">
        <h1>DeweyOS Portal</h1>
        <p>System page loaded successfully.</p>
        <ul>
          <li>Version: 1.0</li>
          <li>Edition: Portfolio</li>
          <li>Developer: Deweys Studio</li>
        </ul>
      </body>
      </html>
    `;
  }

  return `
    <html>
    <body style="margin:0;font-family:Arial;background:#0b1020;color:white;display:grid;place-items:center;height:100vh;">
      <h1>Dewey Chrome Home</h1>
    </body>
    </html>
  `;
}

function loadHistoryPage(url) {
  chromeAddress.value = url;
  chromeTabText.textContent = getTabText(url);

  if (url === "home://welcome") {
    showChromeHome();
    chromeFrame.removeAttribute("srcdoc");
    chromeFrame.src = "about:blank";
    return;
  }

  if (url.startsWith("github://")) {
    if (url === "github://deweyos") {
      openGithubPage("deweyos");
    } else if (url === "github://media") {
      openGithubPage("media");
    } else {
      openGithubPage("hosting");
    }
    return;
  }

  showChromeViewer();

  if (url.startsWith("home://")) {
    chromeFrame.srcdoc = getInternalChromePage(url);
  } else {
    chromeFrame.removeAttribute("srcdoc");
    chromeFrame.src = normalizeUrl(url);
  }
}

chromeGo.addEventListener("click", () => {
  if (!chromeAddress.value.trim()) return;

  const value = chromeAddress.value.trim();

  if (value === "home://welcome") {
    openWindow("chromeWindow");

    fakeHistory = fakeHistory.slice(0, fakeHistoryIndex + 1);
    fakeHistory.push(value);
    fakeHistoryIndex = fakeHistory.length - 1;

    showChromeHome();
    chromeTabText.textContent = "New Tab";
    return;
  }

  if (value === "github://deweyos") {
    openGithubPage("deweyos");
    return;
  }

  if (value === "github://media") {
    openGithubPage("media");
    return;
  }

  if (value === "github://hosting-private") {
    openGithubPage("hosting");
    return;
  }

  openChromePage(value);
});

chromeAddress.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    chromeGo.click();
  }
});

chromeBack.addEventListener("click", () => {
  if (fakeHistoryIndex > 0) {
    fakeHistoryIndex--;
    loadHistoryPage(fakeHistory[fakeHistoryIndex]);
  }
});

chromeForward.addEventListener("click", () => {
  if (fakeHistoryIndex < fakeHistory.length - 1) {
    fakeHistoryIndex++;
    loadHistoryPage(fakeHistory[fakeHistoryIndex]);
  }
});

chromeRefresh.addEventListener("click", () => {
  const current = chromeAddress.value.trim();
  if (!current) return;

  if (current === "home://welcome") {
    showChromeHome();
    return;
  }

  if (current === "github://deweyos") {
    renderGithubPage("deweyos");
    showChromeGithub();
    return;
  }

  if (current === "github://media") {
    renderGithubPage("media");
    showChromeGithub();
    return;
  }

  if (current === "github://hosting-private") {
    renderGithubPage("hosting");
    showChromeGithub();
    return;
  }

  showChromeViewer();

  if (current.startsWith("home://")) {
    chromeFrame.srcdoc = getInternalChromePage(current);
  } else {
    chromeFrame.src = normalizeUrl(current);
  }
});

setInterval(() => {
  cpuStat.textContent = `${Math.floor(30 + Math.random() * 35)}%`;
  ramStat.textContent = `${Math.floor(45 + Math.random() * 35)}%`;
  nodeStat.textContent = `${3 + Math.floor(Math.random() * 2)}`;
  uptimeStat.textContent = `${(99.7 + Math.random() * 0.29).toFixed(2)}%`;
  mcCount.textContent = `${10 + Math.floor(Math.random() * 4)} Active`;
  rustCount.textContent = `${3 + Math.floor(Math.random() * 3)} Active`;
}, 3000);