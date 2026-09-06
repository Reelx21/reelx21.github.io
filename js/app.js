(() => {
  "use strict";

  const feed = document.getElementById("feed");
  const empty = document.getElementById("empty");

  const viewsKey = "reelx21_views";
  const likesKey = "reelx21_likes";

  const readStore = (key) => {
    try { return JSON.parse(localStorage.getItem(key) || "{}"); }
    catch { return {}; }
  };

  const writeStore = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  let views = readStore(viewsKey);
  let likes = readStore(likesKey);

  function cloudinaryPoster(src) {
    if (!src || !src.includes("res.cloudinary.com/")) return "";
    return src
      .replace("/video/upload/", "/video/upload/so_0/")
      .replace(/\.(mp4|webm|mov)(\?.*)?$/i, ".jpg");
  }

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, c => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[c]));
  }

  function shareVideo(video) {
    const url = new URL(location.href);
    url.searchParams.set("v", video.id);

    if (navigator.share) {
      navigator.share({
        title: video.title || "Reelx21",
        text: video.description || "",
        url: url.href
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url.href).then(() => {
        alert("Link video disalin.");
      }).catch(() => {});
    } else {
      prompt("Salin link video:", url.href);
    }
  }

  function addView(id, card) {
    if (card.dataset.viewed === "1") return;
    card.dataset.viewed = "1";
    views[id] = Number(views[id] || 0) + 1;
    writeStore(viewsKey, views);

    const counter = card.querySelector(".view-count");
    if (counter) counter.textContent = formatNumber(views[id]);
  }

  function formatNumber(n) {
    n = Number(n || 0);
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(".0","") + "M";
    if (n >= 1000) return (n / 1000).toFixed(1).replace(".0","") + "K";
    return String(n);
  }

  function toggleLike(video, button) {
    const liked = Boolean(likes[video.id]);
    likes[video.id] = !liked;
    writeStore(likesKey, likes);
    button.classList.toggle("active", !liked);
    button.querySelector(".icon").textContent = !liked ? "♥" : "♡";
    button.querySelector(".label").textContent = !liked ? "Liked" : "Like";
  }

  function makeCard(video, index) {
    const card = document.createElement("article");
    card.className = "reel";
    card.dataset.id = video.id;
    card.dataset.index = index;

    const poster = video.poster || cloudinaryPoster(video.src);
    const initialLiked = Boolean(likes[video.id]);

    card.innerHTML = `
      <video
        class="reel-video"
        playsinline
        webkit-playsinline
        preload="metadata"
        loop
        ${poster ? `poster="${escapeHTML(poster)}"` : ""}
      >
        <source src="${escapeHTML(video.src)}" type="video/mp4">
      </video>

      <div class="shade"></div>

      <div class="top-overlay">
        <strong>Reelx21</strong>
      </div>

      <div class="bottom-info">
        <h2>${escapeHTML(video.title || "Reel")}</h2>
        <p>${escapeHTML(video.description || "")}</p>
      </div>

      <div class="actions">
        <button class="action like-btn ${initialLiked ? "active" : ""}" type="button" aria-label="Like">
          <span class="icon">${initialLiked ? "♥" : "♡"}</span>
          <span class="label">${initialLiked ? "Liked" : "Like"}</span>
        </button>

        <button class="action share-btn" type="button" aria-label="Share">
          <span class="icon">↗</span>
          <span class="label">Share</span>
        </button>

        <button class="action mute-btn" type="button" aria-label="Mute">
          <span class="icon">🔇</span>
          <span class="label">Sound</span>
        </button>

        <div class="action views">
          <span class="icon">◉</span>
          <span class="label view-count">${formatNumber(views[video.id])}</span>
        </div>
      </div>

      <button class="center-play" type="button" aria-label="Play/Pause">▶</button>
    `;

    const videoEl = card.querySelector("video");
    const playButton = card.querySelector(".center-play");
    const muteButton = card.querySelector(".mute-btn");
    const likeButton = card.querySelector(".like-btn");
    const shareButton = card.querySelector(".share-btn");

    videoEl.muted = true;

    playButton.addEventListener("click", () => {
      if (videoEl.paused) videoEl.play().catch(() => {});
      else videoEl.pause();
    });

    videoEl.addEventListener("click", () => {
      if (videoEl.paused) videoEl.play().catch(() => {});
      else videoEl.pause();
    });

    videoEl.addEventListener("play", () => {
      playButton.classList.add("hidden");
    });

    videoEl.addEventListener("pause", () => {
      playButton.classList.remove("hidden");
    });

    muteButton.addEventListener("click", () => {
      videoEl.muted = !videoEl.muted;
      muteButton.querySelector(".icon").textContent = videoEl.muted ? "🔇" : "🔊";
    });

    likeButton.addEventListener("click", () => toggleLike(video, likeButton));
    shareButton.addEventListener("click", () => shareVideo(video));

    return card;
  }

  if (!Array.isArray(VIDEOS) || VIDEOS.length === 0) {
    empty.hidden = false;
    return;
  }

  const fragment = document.createDocumentFragment();
  VIDEOS.forEach((video, index) => {
    fragment.appendChild(makeCard(video, index));

    // Put the ad section after the first reel, then after every 3 reels.
    // This keeps ads outside the video player and avoids covering controls.
    if ((index === 0 || (index + 1) % 3 === 0) && window.Reelx21Ads) {
      const adSection = document.createElement("section");
      adSection.className = "reel-ad-section";
      adSection.setAttribute("aria-label", "Advertisement");
      adSection.appendChild(window.Reelx21Ads.createNativeAd());
      adSection.appendChild(window.Reelx21Ads.createBannerAd());
      fragment.appendChild(adSection);
    }
  });
  feed.appendChild(fragment);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      const video = card.querySelector("video");

      if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
        document.querySelectorAll(".reel-video").forEach(other => {
          if (other !== video) {
            other.pause();
            other.currentTime = Math.min(other.currentTime, 0);
          }
        });

        video.play().catch(() => {});
        addView(card.dataset.id, card);
      } else {
        video.pause();
      }
    });
  }, { threshold: [0, 0.65, 1] });

  document.querySelectorAll(".reel").forEach(card => observer.observe(card));

  // If the page was opened with ?v=VIDEO_ID, scroll to that video.
  const targetId = new URLSearchParams(location.search).get("v");
  if (targetId) {
    const target = document.querySelector(`.reel[data-id="${CSS.escape(targetId)}"]`);
    if (target) setTimeout(() => target.scrollIntoView({ behavior: "instant" }), 100);
  }

  // Keyboard support on desktop.
  window.addEventListener("keydown", (e) => {
    if (e.code !== "Space" && e.code !== "ArrowDown" && e.code !== "ArrowUp") return;
    const cards = [...document.querySelectorAll(".reel")];
    const current = cards.findIndex(c => {
      const r = c.getBoundingClientRect();
      return r.top < innerHeight * 0.55 && r.bottom > innerHeight * 0.45;
    });
    if (current < 0) return;

    if (e.code === "Space") {
      e.preventDefault();
      cards[current].querySelector("video").paused
        ? cards[current].querySelector("video").play().catch(() => {})
        : cards[current].querySelector("video").pause();
    }

    if (e.code === "ArrowDown" && cards[current + 1]) {
      e.preventDefault();
      cards[current + 1].scrollIntoView({ behavior: "smooth" });
    }

    if (e.code === "ArrowUp" && cards[current - 1]) {
      e.preventDefault();
      cards[current - 1].scrollIntoView({ behavior: "smooth" });
    }
  });
})();
