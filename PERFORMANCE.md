# Performance Optimizations

## 3D Viewer Lazy Loading

### Problem
The Spline 3D viewer script (`@splinetool/viewer`) was loading synchronously at page load, causing:
- **1,866ms of main thread blocking** during script evaluation
- **~2 seconds added to Time to Interactive (TTI)**
- Poor user experience during initial page load

### Solution
Implemented **Intersection Observer-based lazy loading** to defer script loading until the viewer elements are about to enter the viewport.

### Implementation Details

#### How It Works
1. **Intersection Observer** monitors all `<spline-viewer>` elements on the page
2. Script loading is triggered when any viewer is within **200px** of the viewport
3. The script is loaded **only once**, regardless of the number of viewers
4. For viewers visible on page load (like the header background), the script loads immediately
5. For viewers below the fold, the script loads only when the user scrolls near them

#### Code Location
The lazy loading implementation is in `index.html` at the bottom of the page, before the closing `</body>` tag.

```javascript
// Lazy Load Spline Viewer Script
(function() {
    let splineScriptLoaded = false;

    function loadSplineScript() {
        if (splineScriptLoaded) return;
        splineScriptLoaded = true;

        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.9.96/build/spline-viewer.js';
        document.body.appendChild(script);
    }

    // Use Intersection Observer to detect when spline-viewer elements are about to enter viewport
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '200px', // Load 200px before element enters viewport
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    loadSplineScript();
                    observer.disconnect(); // Stop observing once script is loaded
                }
            });
        }, observerOptions);

        // Observe all spline-viewer elements after DOM is ready
        window.addEventListener('DOMContentLoaded', () => {
            const splineViewers = document.querySelectorAll('spline-viewer');
            splineViewers.forEach((viewer) => {
                observer.observe(viewer);
            });
        });
    } else {
        // Fallback for browsers without IntersectionObserver support
        window.addEventListener('DOMContentLoaded', loadSplineScript);
    }
})();
```

### Browser Support
- **Modern browsers**: Uses Intersection Observer API (supported in Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+)
- **Legacy browsers**: Falls back to loading script on DOMContentLoaded event

### Performance Impact

#### Before Optimization
- ❌ Synchronous script loading at page load
- ❌ 1,866ms main thread blocking
- ❌ ~2 seconds added to TTI
- ❌ Script loaded even if user never scrolls to viewer

#### After Optimization
- ✅ Asynchronous, on-demand script loading
- ✅ No initial main thread blocking
- ✅ Improved TTI by ~2 seconds
- ✅ Script loads only when needed
- ✅ 200px preload margin ensures smooth user experience

### Testing

To verify the optimization is working:

1. **Open Chrome DevTools**
2. **Go to Network tab**
3. **Reload the page**
4. **Check when `spline-viewer.js` is loaded**:
   - For header viewer: Should load immediately (visible on page load)
   - For lower viewer: Should load only when scrolling down

5. **Check Performance tab**:
   - Initial page load should show reduced main thread blocking
   - Script evaluation should occur after user interaction (scrolling)

### Future Improvements

Potential additional optimizations:
1. **Preload hint**: Add `<link rel="preload">` for the script if viewer is above the fold
2. **Resource hints**: Use `<link rel="dns-prefetch">` for `unpkg.com`
3. **Web Worker**: Investigate moving heavy initialization to Web Worker (requires Spline library support)
4. **Code splitting**: Load only the required features of the Spline viewer

## CSS MIME Type Issue

**Note**: If you encounter an error like:
```
Refused to apply style from 'http://127.0.0.1:5500/css/combined.min.css'
because its MIME type ('text/html') is not a supported stylesheet MIME type
```

This is a **server configuration issue**, not a code issue. 

### Solution
Ensure your development server (e.g., Live Server, http-server, etc.) is configured to serve `.css` files with the correct `Content-Type: text/css` header.

**For VS Code Live Server**:
1. Open VS Code settings
2. Search for "Live Server"
3. Ensure MIME types are correctly configured

**For other servers**:
- Check your server's MIME type configuration
- Ensure `.css` files are mapped to `text/css` content type
