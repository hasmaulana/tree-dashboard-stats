# TreeStats - Analytics Dashboard

A modern, client-side visual analytics dashboard designed to visualize social media performance data. Built with Vanilla JavaScript and Tailwind CSS, offering a premium, responsive user experience without the need for a backend server.

## Features

- 📊 **Instant Analytics**: Drag and drop your JSON data to generate stats immediately.
- 📈 **Interactive Charts**: 
  - **Activity Over Time**: Line chart showing posting frequency.
  - **Content Distribution**: Doughnut chart breaking down media types.
  - **Engagement Analysis**: Bar chart showing likes distribution.
- 🏆 **Advanced Leaderboard**: 
  - View top contributors.
  - **Search**: Filter users by name instantly.
  - **Sort**: Order by Posts, Total Likes, or Average Likes.
- 👤 **Detailed User Profiles**: 
  - Interactive modal with user specific statistics.
  - **Media Gallery**: Lazy-loaded masonry-style gallery of user posts with hover details (date, likes, comments).
- 🌓 **Modern UI**: Dark mode aesthetic with glassmorphism effects and smooth transitions.
- ⚡ **100% Client-Side**: Privacy-focused; data is processed locally in the browser.

## Tech Stack

- **Core**: HTML5, Vanilla JavaScript (ES6 modules)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (CDN)
- **Charts**: [Chart.js](https://www.chartjs.org/)
- **Icons**: [FontAwesome](https://fontawesome.com/)

## Getting Started

### Prerequisites
You need a modern web browser (Chrome, Firefox, Edge, Safari).

### Usage

1. **Open the Application**:
   Simply double-click `index.html` to open it in your browser.
   *Tip: For the best experience, serve it using a local development server (like VS Code's "Live Server") to ensure all assets load correctly.*

2. **Load Data**:
   - The app launches in the "Upload View".
   - Drag and drop a valid JSON file onto the dropzone, or click to select a file.
   - Use the provided `dummy_data.json` to test the dashboard capabilities.

## Data Format Requirements

The application expects a JSON file containing an **array of objects**. Each object represents a post and should adhere to the following structure:

```json
[
  {
    "post_id": "unique_id",
    "url": "https://example.com/image.jpg",
    "thumbnail": "https://example.com/thumb.jpg", 
    "caption": "Post caption text",
    "content_type": "photo" | "video",
    "created_at": "2026-01-25T10:18:33Z",
    "likes_count": 150,
    "comment_count": 23,
    "member": {
      "username": "username_here",
      "photo": "https://example.com/avatar.jpg",
      "creator_status": "verified" | "regular"
    }
  }
]
```

## Project Structure

```
├── css/
│   └── style.css       # Custom styles (scrollbar, animations, glassmorphism)
├── js/
│   ├── app.js          # Entry point, event listeners, file handling
│   ├── ui.js           # UI rendering, DOM manipulation, Chart.js config
│   └── analytics.js    # Data processing logic and math
├── dummy_data.json     # Sample dataset for testing
├── index.html          # Main application structure
└── README.md           # Project documentation
```

## Customization

- **Colors**: The theme uses Tailwind's configuration in the `<head>` of `index.html`. You can adjust the `primary`, `secondary`, and `accent` colors there.
- **Charts**: Chart configurations can be modified in `js/ui.js` under the `renderCharts` method.

## License

This project is open-source and available for personal and educational use.
