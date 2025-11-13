import { apiInitializer } from "discourse/lib/api";
import { schedule } from "@ember/runloop";

export default apiInitializer("1.8.0", (api) => {
  api.onPageChange(() => {
    schedule("afterRender", () => {
      // Remove existing banner
      const existing = document.querySelector(".simple-announcement-card");
      if (existing) existing.remove();

      // Get theme settings from the Discourse API
      const siteSettings = api.container.lookup("service:site-settings");
      
      // Access theme settings - they're prefixed with the theme name
      const announcementEnabled = settings.announcement_enabled;
      const announcementTopicUrl = settings.announcement_topic_url;
      const announcementThumbnail = settings.announcement_thumbnail;
      const announcementTitle = settings.announcement_title || "Announcement";
      const announcementDescription = settings.announcement_description || "Click to read more";
      const showOnHomepageOnly = settings.show_on_homepage_only;

      // Check if banner should show
      if (!announcementEnabled || !announcementTopicUrl) {
        return;
      }

      // Check page visibility
      const currentPath = window.location.pathname;
      const isHomepage = currentPath === "/" || currentPath.startsWith("/categories");

      if (showOnHomepageOnly && !isHomepage) {
        return;
      }

      // Build HTML
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

      // Insert after welcome banner or at beginning of main content
      const welcomeBanner = document.querySelector(".welcome-banner");
      if (welcomeBanner) {
        welcomeBanner.insertAdjacentHTML("afterend", html);
      } else {
        const mainOutlet = document.querySelector("#main-outlet");
        if (mainOutlet) {
          mainOutlet.insertAdjacentHTML("afterbegin", html);
        }
      }
    });
  });
});
