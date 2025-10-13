# Testing Guide for Performance Optimization

## Manual Verification of Lazy Loading

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Browser Developer Tools access

### Test Scenarios

#### Test 1: Verify Script Loading Behavior

**Steps:**
1. Open `index.html` in your web browser
2. Open Developer Tools (F12 or Right-click → Inspect)
3. Go to the **Network** tab
4. Refresh the page (Ctrl+R or Cmd+R)
5. Look for `spline-viewer.js` in the network requests

**Expected Results:**
- ✅ The `spline-viewer.js` script should load immediately (because the header viewer is visible on page load)
- ✅ The script should be loaded as a `module` type
- ✅ The script should only be loaded **once** (not twice like before)

#### Test 2: Verify Intersection Observer

**Steps:**
1. Open `index.html` in your browser
2. Open Developer Tools Console tab
3. Paste and run the following code:

```javascript
// Check if Intersection Observer is being used
console.log('IntersectionObserver supported:', 'IntersectionObserver' in window);

// Monitor script loading
const originalAppendChild = document.body.appendChild;
document.body.appendChild = function(element) {
    if (element.tagName === 'SCRIPT' && element.src.includes('spline-viewer')) {
        console.log('✅ Spline viewer script loaded:', element.src);
    }
    return originalAppendChild.call(this, element);
};
```

4. Reload the page
5. Check the console for the log message

**Expected Results:**
- ✅ Console should show "IntersectionObserver supported: true"
- ✅ Console should show "✅ Spline viewer script loaded: [URL]" when the viewer is in/near viewport

#### Test 3: Performance Impact

**Steps:**
1. Open `index.html` in Chrome
2. Open Developer Tools
3. Go to the **Performance** tab
4. Click the record button (circle icon)
5. Refresh the page
6. Wait for the page to fully load
7. Stop recording

**Expected Results:**
- ✅ In the main thread timeline, you should see the Spline script evaluation happening:
  - **If header viewer is visible**: Script loads immediately but asynchronously
  - **If you scroll**: Script evaluation occurs when viewer approaches viewport
- ✅ Initial page load should have less main thread blocking compared to before

#### Test 4: Lazy Loading for Below-Fold Viewer

**Steps:**
1. Open `index.html` in your browser
2. Open Developer Tools → Network tab
3. Clear network log
4. Keep the page at the top (don't scroll)
5. Observe the network requests

**What to Check:**
- The first spline-viewer (in header) triggers immediate script load
- The script is loaded only once

**Then:**
6. Scroll down slowly towards the "Features" section (second viewer)
7. Watch for any additional network activity

**Expected Results:**
- ✅ Script is already loaded from the first viewer
- ✅ No duplicate script loading occurs
- ✅ Second viewer initializes using the already-loaded script

#### Test 5: Browser Compatibility

**Steps:**
1. Test in Chrome (latest version)
2. Test in Firefox (latest version)
3. Test in Safari (latest version)
4. Test in Edge (latest version)

**Expected Results:**
- ✅ All browsers should load the 3D viewers correctly
- ✅ No console errors
- ✅ 3D models render properly
- ✅ Fallback works for older browsers (loads on DOMContentLoaded)

#### Test 6: Visual Verification

**Steps:**
1. Open `index.html` in your browser
2. Scroll through the entire page
3. Check both 3D viewers

**Expected Results:**
- ✅ **Header viewer**: 3D background displays correctly behind the profile
- ✅ **Features viewer**: 3D model displays correctly in the features section
- ✅ Both viewers are interactive and respond to mouse movements
- ✅ No "Build with Spline" logo appears (removed by existing logic in main.js)

### Debugging

If you encounter issues:

1. **Script not loading at all:**
   - Check browser console for errors
   - Verify internet connection (script loads from unpkg.com)
   - Check if Content Security Policy is blocking the script

2. **Viewer not displaying:**
   - Check if the spline-viewer custom element is registered
   - Verify the URL to the Spline scene is correct
   - Check browser console for errors

3. **Script loading multiple times:**
   - Verify the duplicate script tags were removed (should only be one lazy-load script)
   - Check the `splineScriptLoaded` flag is working correctly

### Performance Comparison

To compare performance before and after:

1. **Before optimization** (original version with synchronous loading):
   - Main thread blocked for ~1,866ms during script evaluation
   - TTI delayed by ~2 seconds

2. **After optimization** (with lazy loading):
   - Script loads asynchronously when viewer is in/near viewport
   - No initial main thread blocking
   - TTI improved by ~2 seconds

### Success Criteria

The optimization is successful if:
- ✅ Script loads only once (not twice)
- ✅ Script loads asynchronously (doesn't block main thread)
- ✅ Both 3D viewers render correctly
- ✅ No visual regression
- ✅ No JavaScript errors in console
- ✅ Improved Time to Interactive (TTI)

## Automated Testing (Future)

For future automated testing, consider:
- Lighthouse CI for performance metrics
- Puppeteer/Playwright for automated browser testing
- Jest for unit testing the lazy loading logic
- Visual regression testing with Percy or similar tools
