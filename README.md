# Member Splash Custom Discourse Components

* Adds a customizable announcement banner with thumbnail, title, description, and link.
* Creates navigation menus for all pages with links to home, latest and support plus breadcrumbs when viewing a single topic

## Features

- Easy-to-use settings interface
- Upload thumbnail images directly
- Customizable title and description
- Link to any topic in your forum
- Choose to display on homepage only or all pages
- Mobile responsive design
- Uses Discourse's native color scheme variables

## Installation

### From GitHub

1. Go to **Admin** → **Customize** → **Themes**
2. Click **Install** → **From a git repository**
3. Enter: `https://github.com/YOUR-USERNAME/discourse-simple-announcement-banner`
4. Click **Install**
5. Add to your active theme

### Manual Installation

1. Create a new component in Discourse
2. Copy `common/after_header.html` to the After Header tab
3. Copy `common/common.scss` to the CSS tab
4. Save and add to your theme

## Configuration

Configure in the component settings:

1. **Enable/Disable**: Toggle the banner
2. **Thumbnail**: Upload an image (recommended: 150x150px or larger)
3. **Title**: Announcement title
4. **Description**: Brief description (2-3 sentences)
5. **Topic URL**: Full URL to your announcement topic
6. **Homepage Only**: Show only on homepage or all pages

## License

MIT License
