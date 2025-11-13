import { apiInitializer } from "discourse/lib/api";
import { schedule } from "@ember/runloop";

export default apiInitializer("1.8.0", (api) => {
  api.onPageChange(() => {
    schedule("afterRender", () => {
      // ===== ANNOUNCEMENT BANNER LOGIC =====
      const existing = document.querySelector(".simple-announcement-card");
      if (existing) existing.remove();

      const announcementEnabled = settings.announcement_enabled;
      const announcementTopicUrl = settings.announcement_topic_url;
      const announcementThumbnail = settings.announcement_thumbnail;
      const announcementTitle = settings.announcement_title || "Announcement";
      const announcementDescription = settings.announcement_description || "Click to read more";
      const showOnHomepageOnly = settings.show_on_homepage_only;

      if (announcementEnabled && announcementTopicUrl) {
        const currentPath = window.location.pathname;
        const isHomepage = currentPath === "/" || currentPath.startsWith("/categories");

        if (!showOnHomepageOnly || isHomepage) {
          const thumbnailHtml = announcementThumbnail
            ? `<img src="${announcementThumbnail}" class="announcement-thumb" alt="Announcement">`
            : "";

          const html = `
            <div class="simple-announcement-card">
              <a href="${announcementTopicUrl}" class="announcement-link">
                ${thumbnailHtml}
                <div class="announcement-content">
                  <h3>${announcementTitle}</h3>
                  <p>${announcementDescription}</p>
                  <span class="read-more">Read more →</span>
                </div>
              </a>
            </div>
          `;

          const welcomeBanner = document.querySelector(".welcome-banner");
          if (welcomeBanner) {
            welcomeBanner.insertAdjacentHTML("afterend", html);
          } else {
            const mainOutlet = document.querySelector("#main-outlet");
            if (mainOutlet) {
              mainOutlet.insertAdjacentHTML("afterbegin", html);
            }
          }
        }
      }

      // ===== ADD NAVIGATION TO TOPIC PAGES =====
      const currentPath = window.location.pathname;
      const isTopicPage = currentPath.startsWith("/t/");
      
      if (isTopicPage) {
        const existingTopicNav = document.querySelector(".topic-navigation-pills");
        if (existingTopicNav) existingTopicNav.remove();
        
        const topicTitle = document.querySelector("#topic-title");
        
        if (topicTitle) {
          const navHtml = `
            <nav class="topic-navigation-pills">
              <ul class="nav-pills" style="background: rgba(255, 255, 255, 0.5); padding: 8px; border-radius: 12px; display: flex; gap: 6px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); margin-bottom: 20px; list-style: none;">
                <li style="margin: 0;">
                  <a href="/" style="padding: 10px 20px; border-radius: 8px; font-weight: 500; font-size: 15px; transition: all 0.2s ease; border: none; background: transparent; text-decoration: none; display: block; color: var(--primary);">Home</a>
                </li>
                <li style="margin: 0;">
                  <a href="/latest" style="padding: 10px 20px; border-radius: 8px; font-weight: 500; font-size: 15px; transition: all 0.2s ease; border: none; background: transparent; text-decoration: none; display: block; color: var(--primary);">Latest</a>
                </li>
              </ul>
            </nav>
          `;
          
          topicTitle.insertAdjacentHTML("beforebegin", navHtml);
          
          // Add hover effects
          document.querySelectorAll(".topic-navigation-pills a").forEach(link => {
            link.addEventListener("mouseenter", (e) => {
              e.target.style.background = "rgba(74, 158, 255, 0.1)";
              e.target.style.color = "var(--tertiary)";
              e.target.style.transform = "translateY(-1px)";
            });
            link.addEventListener("mouseleave", (e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "var(--primary)";
              e.target.style.transform = "translateY(0)";
            });
          });
        }
      }
      
      // ===== ADD NAVIGATION TO SEARCH PAGE =====
      const isSearchPage = currentPath.startsWith("/search");

      if (isSearchPage) {
        const existingSearchNav = document.querySelector(".search-navigation-pills");
        if (existingSearchNav) existingSearchNav.remove();
        
        const searchContainer = document.querySelector(".search-container") || document.querySelector(".search-header");
        
        if (searchContainer) {
          const navHtml = `
            <nav class="search-navigation-pills">
              <ul class="nav-pills" style="background: rgba(255, 255, 255, 0.5); padding: 8px; border-radius: 12px; display: flex; gap: 6px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); margin-bottom: 20px; list-style: none;">
                <li style="margin: 0;">
                  <a href="/" style="padding: 10px 20px; border-radius: 8px; font-weight: 500; font-size: 15px; transition: all 0.2s ease; border: none; background: transparent; text-decoration: none; display: block; color: var(--primary);">Home</a>
                </li>
                <li style="margin: 0;">
                  <a href="/latest" style="padding: 10px 20px; border-radius: 8px; font-weight: 500; font-size: 15px; transition: all 0.2s ease; border: none; background: transparent; text-decoration: none; display: block; color: var(--primary);">Latest</a>
                </li>
                <li style="margin: 0;">
                  <a href="https://support.membersplash.com" target="_blank" rel="noopener noreferrer" style="padding: 10px 20px; border-radius: 8px; font-weight: 500; font-size: 15px; transition: all 0.2s ease; border: none; background: transparent; text-decoration: none; display: block; color: var(--primary);">Support</a>
                </li>
              </ul>
            </nav>
          `;
          
          searchContainer.insertAdjacentHTML("beforebegin", navHtml);
          
          // Add hover effects
          document.querySelectorAll(".search-navigation-pills a").forEach(link => {
            link.addEventListener("mouseenter", (e) => {
              e.target.style.background = "rgba(74, 158, 255, 0.1)";
              e.target.style.color = "var(--tertiary)";
              e.target.style.transform = "translateY(-1px)";
            });
            link.addEventListener("mouseleave", (e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "var(--primary)";
              e.target.style.transform = "translateY(0)";
            });
          });
        }
      }
      
      // Make external links open in new tab
      const supportLink = document.querySelector('.nav-item_custom_support a');
      if (supportLink) {
        supportLink.setAttribute('target', '_blank');
        supportLink.setAttribute('rel', 'noopener noreferrer');
      }
    });
  });
});
