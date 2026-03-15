const blacklistedSites = ["facebook.com", "twitter.com", "instagram.com", "youtube.com"];

function checkPage() {
  const currentUrl = window.location.hostname;
  if (blacklistedSites.some(site => currentUrl.includes(site))) {
    document.body.innerHTML = `
      <div class="focus-block-overlay">
        <h1>Get back to work!</h1>
        <p>FocusFlow AI has detected a distraction. Your session is active.</p>
        <button id="resume-session">I'm focused now</button>
      </div>
    `;
    document.body.classList.add("focus-enforced");
  }
}

checkPage();
