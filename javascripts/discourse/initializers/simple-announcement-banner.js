import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.8.0", (api) => {
  api.onPageChange(() => {
    const settings = api.container.lookup("service:site-settings");
    
    console.log('=== Simple Announcement Banner ===');
    console.log('Settings:', settings);
    
    // Remove existing banner
    const existing = document.querySelector('.simple-announcement-card');
    if (existing) existing.remove();
    
    // Get theme settings
    const themeSettings = settings.theme_settings || {};
    const announcementEnabled = themeSettings.announcement_enabled;
    const announcementTopicUrl = themeSettings.announcement_topic_url;
    const announcementThumbnail = themeSettings.announcement_thumbnail;
    const announcementTitle = themeSettings.announcement_title;
    const announcementDescription = themeSettings.announcement_description;
    const showOnHomepageOnly = themeSettings.show_on_homepage_only;
    
    // Check if banner should show
    if (!announcementEnabled || !announcementTopicUrl) {
      console.log('Banner disabled or no URL configured');
      return;
    }
    
    // Check page visibility
    const currentPath = window.location.pathname;
    const isHomepage = currentPath === '/' || currentPath.startsWith('/categories');
    
    if (showOnHomepageOnly && !isHomepage) {
      console.log('Not showing - not on homepage');
      return;
    }
    
    console.log('Building banner...');
    
    // Build HTML
    const thumbnailHtml = announcementThumbnail 
      ? `<img src="${announcementThumbnail}" class="announcement-thumb" alt="Announcement">` 
      : '';
    
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
    
    // Insert banner
    const mainOutlet = document.querySelector('#main-outlet');
    if (mainOutlet) {
      mainOutlet.insertAdjacentHTML('afterbegin', html);
      console.log('Banner inserted successfully!');
    } else {
      console.log('ERROR: #main-outlet not found');
    }
  });
});
