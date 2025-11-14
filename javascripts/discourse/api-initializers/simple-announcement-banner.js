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

      // ===== BREADCRUMB NAVIGATION =====
      const existingBreadcrumbs = document.querySelector(".custom-breadcrumbs");
      if (existingBreadcrumbs) existingBreadcrumbs.remove();

      const currentPath = window.location.pathname;
      const isTopicPage = currentPath.startsWith("/t/");
      const isCategoryPage = currentPath.startsWith("/c/");
      
      // Only show breadcrumbs on topic and category pages
      if (isTopicPage || isCategoryPage) {
        let breadcrumbHtml = `
          <nav class="custom-breadcrumbs" style="background: rgba(255, 255, 255, 0.5); padding: 10px 16px; border-radius: 12px; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); margin-bottom: 20px; flex-wrap: wrap; font-size: 14px;">
            <a href="/" class="breadcrumb-item" style="color: var(--primary-high); text-decoration: none; font-weight: 500; transition: all 0.2s ease;">🏠 Home</a>
        `;
        
        // Try to find category information
        const categoryLink = document.querySelector('.category-link, a[href*="/c/"]');
        const categoryTitle = document.querySelector('.category-title-header h1, .category-name');
        
        if (categoryLink && categoryTitle) {
          const categoryHref = categoryLink.getAttribute('href');
          const categoryName = categoryTitle.textContent.trim();
          breadcrumbHtml += `
            <span class="breadcrumb-separator" style="color: var(--primary-medium); user-select: none;">›</span>
            <a href="${categoryHref}" class="breadcrumb-item" style="color: var(--primary-high); text-decoration: none; font-weight: 500; transition: all 0.2s ease;">${categoryName}</a>
          `;
        }
        
        // If we're on a topic page, add the topic title
        if (isTopicPage) {
          const topicTitle = document.querySelector('.fancy-title');
          if (topicTitle) {
            const titleText = topicTitle.textContent.trim();
            // Truncate if too long
            const displayTitle = titleText.length > 50 ? titleText.substring(0, 50) + '...' : titleText;
            breadcrumbHtml += `
              <span class="breadcrumb-separator" style="color: var(--primary-medium); user-select: none;">›</span>
              <span class="breadcrumb-item current" style="color: var(--primary); font-weight: 600;">${displayTitle}</span>
            `;
          }
        }
        
        breadcrumbHtml += '</nav>';
        
        // Insert breadcrumbs
        const mainOutlet = document.querySelector("#main-outlet");
        if (mainOutlet) {
          mainOutlet.insertAdjacentHTML("afterbegin", breadcrumbHtml);
          
          // Add hover effects to breadcrumb links
          document.querySelectorAll(".custom-breadcrumbs .breadcrumb-item:not(.current)").forEach(link => {
            link.addEventListener("mouseenter", (e) => {
              e.target.style.color = "var(--tertiary)";
              e.target.style.transform = "translateY(-1px)";
            });
            link.addEventListener("mouseleave", (e) => {
              e.target.style.color = "var(--primary-high)";
              e.target.style.transform = "translateY(0)";
            });
          });
        }
      }

      // ===== ADD NAVIGATION TO TOPIC PAGES =====
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
      
      // ===== FIX MOBILE NAVIGATION =====
      const isMobile = window.innerWidth <= 640;
      const navBar = document.querySelector('#navigation-bar');

      if (isMobile && navBar) {
        // Remove the dropdown toggle button
        const toggleButton = navBar.querySelector('.list-control-toggle-link-trigger');
        if (toggleButton) {
          toggleButton.closest('li').remove();
        }
        
        // Add actual navigation links
        const existingMobileNav = navBar.querySelector('.mobile-nav-items');
        if (!existingMobileNav) {
          const navItems = `
            <li class="mobile-nav-items nav-item_categories" style="margin: 0;">
              <a href="/" style="padding: 8px 16px; border-radius: 8px; font-weight: 500; font-size: 14px; display: block; color: var(--primary); text-decoration: none; white-space: nowrap;">Home</a>
            </li>
            <li class="mobile-nav-items nav-item_latest" style="margin: 0;">
              <a href="/latest" style="padding: 8px 16px; border-radius: 8px; font-weight: 500; font-size: 14px; display: block; color: var(--primary); text-decoration: none; white-space: nowrap;">Latest</a>
            </li>
            <li class="mobile-nav-items nav-item_custom_support" style="margin: 0;">
              <a href="https://support.membersplash.com" target="_blank" rel="noopener noreferrer" style="padding: 8px 16px; border-radius: 8px; font-weight: 500; font-size: 14px; display: block; color: var(--primary); text-decoration: none; white-space: nowrap;">Support</a>
            </li>
          `;
          
          navBar.insertAdjacentHTML('beforeend', navItems);
          
          // Make nav scrollable
          navBar.style.overflowX = 'auto';
          navBar.style.display = 'flex';
          navBar.style.flexWrap = 'nowrap';
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
