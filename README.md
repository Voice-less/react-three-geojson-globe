# React Three Globe

A high-performance interactive 3D globe built with React and Three.js, featuring GeoJSON visualization, animated textures, and customizable regional displays.

![React Three Globe](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

- **Interactive 3D Globe** - Smooth orbital controls with zoom and rotation
- **GeoJSON Visualization** - Support for both line and filled polygon rendering
- **Regional Highlighting** - Custom colors for different geographic regions (Morocco regions showcased)
- **Animated Textures** - Dynamic PNG overlay system with texture switching
- **Wireframe Mode** - Optional wireframe globe display
- **Optimized Performance** - Deferred rendering to prevent UI blocking
- **Galaxy Background** - Immersive space environment
- **Responsive Design** - Scales across different screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/react-three-globe.git
cd react-three-globe

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## 🎮 Usage

### Basic Implementation
```jsx
import ThreeScene from './components/three-scene';

function App() {
  return (
    <div className="App">
      <ThreeScene />
    </div>
  );
}
```

### Control Panel Features
- **Animated PNGs Toggle** - Show/hide animated texture overlays
- **Wireframe Globe** - Display wireframe sphere
- **GeoJSON Display Modes**:
  - None - Clean globe
  - Lines Only - Country/region outlines
  - Filled Regions - Colored polygon areas

## 🏗️ Project Structure

```
src/
├── components/
│   ├── globe/
│   │     ├── FpsCounter.jsx           # FPS Counter
│   │     ├── three-scene.jsx          # Main scene orchestrator
│   │     ├── three-sphere.jsx         # Animated PNG globe
│   │     ├── geojson-lines.jsx        # GeoJSON line rendering
│   │     ├── geojson-filled.jsx       # GeoJSON filled polygons
│   │     └── wireframe-globe.jsx      # Wireframe sphere
│   └── App.jsx
├── assets/
│   ├── data/
│   │   └── final_map.json             # GeoJSON data
│   └── textures/
│       ├── galaxy.png                 # Background texture
│       └── [texture files]            # Globe textures
└── styles/                            # CSS styles
```

## ⚙️ Technical Details

### Core Technologies
- **React 19** - UI framework
- **Three.js** - 3D graphics engine
- **@react-three/fiber** - React Three.js renderer
- **@react-three/drei** - Three.js utilities
- **three-geojson** - GeoJSON to Three.js conversion
- **3d-tiles-renderer** - Geospatial utilities
- **Vite** - Build tool and dev server

### Performance Optimizations
- **Deferred Rendering** - Prevents initial loading freeze
- **Chunked Processing** - Processes large datasets in smaller batches
- **Optimized Materials** - Reused materials for better performance
- **Logarithmic Depth Buffer** - Enhanced depth precision
- **Polygon Offset** - Prevents z-fighting issues

### Camera Configuration
- **FOV**: 45 degrees
- **Near Plane**: 50 units
- **Far Plane**: 800 units
- **Initial Position**: Focused on Morocco (31.6°N, 8.0°W)

## 🌍 GeoJSON Data

The project uses a custom GeoJSON file (`final_map.json`) containing:
- World country boundaries
- Regional subdivisions of Morocco
- Custom properties for styling

### Regional Color Mapping (Morocco Example)
```javascript
const MOROCCO_COLORS = {
  'Tangier-Tetouan-Al Hoceima': 0xff0000,
  'Oriental': 0x00ff00,
  'Fez-Meknes': 0x0000ff,
  // ... more regions
};
```

## 🎨 Customization

### Adding New Regions
1. Update GeoJSON data with region properties
2. Add color mappings in respective components
3. Ensure `admin` and `region_name` properties exist

### Texture Management
- Add textures to `assets/textures/`
- Import in `three-sphere.jsx`
- Update texture switching logic

### Styling Globe Elements
- **Lines**: Modify `LineBasicMaterial` properties
- **Fills**: Adjust `MeshStandardMaterial` settings
- **Background**: Replace `galaxy.png` texture

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Development Notes
- Hot reload enabled for all components
- FPS logger available in development
- Error boundaries for robust debugging

## 📊 Performance Metrics

- **Initial Load**: Optimized for quick first render
- **Frame Rate**: Target 60 FPS on modern devices
- **Memory Usage**: Efficient geometry and texture management
- **Bundle Size**: Optimized with Vite's tree shaking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [three-geojson](https://github.com/gkjohnson/three-geojson) - GeoJSON utilities
- [vasturiano](https://github.com/vasturiano) - Globe visualization inspiration

## 🐛 Known Issues

- LineWidth support varies by WebGL implementation
- Large GeoJSON files may cause initial loading delay
- Mobile performance depends on device GPU capabilities

## 🔮 Future Enhancements

- [ ] Web Worker integration for better performance
- [ ] Globe.gl implementation comparison
- [ ] Real-time data integration
- [ ] Animation timeline controls
- [ ] Export functionality (images/videos)
- [ ] Touch gesture support for mobile

---

Built with ❤️ using React and Three.js
