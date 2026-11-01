# Frontend Practice Labs

Small HTML, CSS and JavaScript learning projects. No framework, package installation or build step is needed.

[![Checks](https://github.com/ayanirfan099/Websites/actions/workflows/ci.yml/badge.svg)](https://github.com/ayanirfan099/Websites/actions/workflows/ci.yml)

The existing `index.html` provides a visual entry point to the examples. CI runs the existing structure and interaction checks. No Pages deployment or publishing change is included.

## Run

Open `index.html` in your browser, or serve the folder locally:

```sh
python3 -m http.server 8000
```

Visit http://localhost:8000. The projects work without a backend.

| Page | Purpose |
| --- | --- |
| [Portfolio](portfolio.html) | Personal introduction and project list |
| [Calculator](calculator.html) | Addition with finite-number validation |
| [Form validation](form-validation.html) | Validate demo fields; no registration or storage |
| [Responsive layout](responsive-layout.html) | Flexible card layout |
| [Color picker](color-picker.html) | Change the background color |
| [University program](university-program.html) | Fictional course information and expandable semesters |

The earlier combined layout/color-picker file is now two valid HTML documents. Source files have descriptive `.html` names, mobile viewport metadata and navigation back to the project index. Old filenames remain available in Git history; update any bookmarks to the new paths.

## Checks

Requires Python 3 and Node.js for these development checks, not for viewing the pages:

```sh
python3 -m unittest discover -s tests -v
node tests/interactions.test.js
```

These checks cover HTML document structure, local links, calculator input and form behavior. They are not a replacement for checking visual appearance and accessibility in a browser.
