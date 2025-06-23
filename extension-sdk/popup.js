
document.addEventListener('DOMContentLoaded', async function () {
    const { email, password } = await chrome.storage.local.get(["email", "password"]);
  
  // Initialize UI based on login state
  toggleLoginUI(!!email && !!password);

  // Login form handler
  document.getElementById("loginSubmit")?.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    if (!email || !password) {
      alert("Please enter both email and password!");
      return;
    }
    
    await chrome.storage.local.set({ email, password });
    toggleLoginUI(true);
  });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        document.getElementById("tabTitle").innerText = tabs[0].title;
    });

    chrome.storage.local.get("logs", function (data) {
        const container = document.getElementById("logContainer");
        container.innerHTML = "";
        if (!data.logs || data.logs.length === 0) {
            container.innerHTML = "<p class='safe'>No SDKs detected. Website is safe to use.</p>";
            return;
        }
        data.logs.slice().reverse().forEach(log => {
            const div = document.createElement("div");
            div.className = "log-entry";
            div.innerHTML = `<span class='badge'>${log.sdk}</span>
                             <span class='method'>[${log.method}]</span>
                             <span class='url'>${log.url}</span>
                             <span class='time'>${log.time}</span>`;
            container.appendChild(div);
        });
    });
});

function toggleLoginUI(isLoggedIn) {
  document.querySelectorAll(".beforeLogin").forEach(el => 
    el.style.display = isLoggedIn ? "none" : "block");
  
  document.querySelectorAll(".afterLogin").forEach(el => 
    el.style.display = isLoggedIn ? "block" : "none");
}
