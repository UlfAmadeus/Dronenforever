# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Run dev server**: `deno task dev` (with file watching)
- **Start production**: `deno task start`
- **Deploy**: `deno task deploy`
- **Run tests**: `deno test`
- **Run single test**: `deno test src/path/to/test.ts`

## Code Style

- **Imports**: Use explicit versioning (e.g., `@0.192.0`) for Deno standard library imports
- **Types**: Always use TypeScript types for function parameters and return values
- **Naming**: Use camelCase for variables/functions, PascalCase for classes
- **Variable Names**: Always use descriptive variable names
- **File Structure**: Keep utility functions in `src/utils/` directory
- **Error Handling**: Use try/catch with console.error for file operations
- **Logging**: Use console.log for debugging information
- **Comments**: Add JSDoc comments for functions with descriptions and param tags
- **Memory Management**: Use the ImageMemoryTracker for caching recently displayed images

## Architecture

The app serves random images from the public/images directory with random Norwegian phrases.

## UI Requirements

- The contents should never extend beyond the browser window (no scrolling)