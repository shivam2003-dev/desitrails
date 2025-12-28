# Image Setup Guide

## Quick Fix - Using Reliable Image Service

The website now uses Picsum Photos (https://picsum.photos) which is more reliable than Unsplash source URLs.

## To Add Real Images from Google/Other Sources

### Option 1: Manual Download (Recommended for now)

1. **For each state**, search Google Images for:
   - `{state name} tourism` (e.g., "Kerala tourism")
   - `{state name} landscape` (e.g., "Rajasthan landscape")
   - `{place name}` (e.g., "Varkala beach")

2. **Download images**:
   - Right-click → Save Image As
   - Save to: `assets/images/states/{state-slug}/hero.jpg`
   - Size: 1600x900px (16:9 ratio)
   - Format: JPG, < 500KB

3. **For route images**:
   - Create route maps or use destination images
   - Save to: `assets/images/states/{state-slug}/routes/{days}.jpg`
   - Example: `assets/images/states/kerala/routes/4.jpg`

4. **For gallery images**:
   - Download images for each place
   - Save to: `assets/images/states/{state-slug}/gallery/{place-slug}.jpg`
   - Example: `assets/images/states/kerala/gallery/varkala.jpg`

### Option 2: Use Image Download Tools

You can use browser extensions or tools like:
- Image Downloader (Chrome Extension)
- Bulk Image Downloader
- wget or curl commands

### Option 3: Use Free Stock Photo Sites

1. **Pexels** (https://pexels.com) - Free, no attribution needed
2. **Pixabay** (https://pixabay.com) - Free images
3. **Unsplash** (https://unsplash.com) - Free, high quality

Search for your destination and download directly.

## Image Requirements

- **Hero images**: 1600x900px, JPG, < 500KB
- **Route images**: 1200x800px, JPG, < 400KB  
- **Gallery images**: 800x600px, JPG, < 300KB

## Current Status

The website will automatically use local images if they exist in the assets folder, otherwise it will use Picsum Photos as a fallback.

