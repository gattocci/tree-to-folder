# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-19

### Added
- **Core Parsing Engine**: Support for converting text-based trees into real directories using a relative indentation algorithm.
- **Smart Sanitization**: Automatic removal of box-drawing characters (`┣`, `┃`, `┗`, `│`), terminal symbols, and AI-generated emojis.
- **Dual Input Methods**:
    - **Editor Mode**: A temporary scratchpad for handling large or complex tree structures.
    - **Quick Input**: A fast pop-up box for single-line or simple paths.
- **Visual Preview**: Added a confirmation modal that shows a preview of all files and folders to be created before touching the disk.
- **Explorer Integration**: Right-click context menu support to generate structures directly into specific folders.
- **Intelligent Type Detection**: Automatic folder detection for items with nested children, even if they have file extensions.

### Fixed
- Improved handling of "chaotic" trees with empty lines or orphan guide lines.
- Fixed an issue where hidden files (like `.gitignore`) were sometimes misidentified as indentation.