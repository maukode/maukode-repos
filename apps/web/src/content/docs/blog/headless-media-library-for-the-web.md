---
title: The Simple Way to Capture Media on the Web
date: 2025-08-22
tags:
  - headless-ui
  - media
  - headless-media
  - web
---

**Introducing `@maukode/headless-media`: The Simple Way to Capture Media on the Web 📸🎙️📹**

Hey everyone\!

Have you ever wanted to add a feature to your web app that lets users take a photo, record a quick video, or capture an audio note? If you have, you probably dove into the Web APIs like `getUserMedia()` and `MediaRecorder`. 
<!-- excerpt -->
While incredibly powerful, they can sometimes feel a bit complex to set up, especially when all you want is a simple, reusable solution.

Today, I'm thrilled to launch a new library I've been working on to solve this exact problem: **`@maukode/headless-media`**.

It’s a lightweight, headless, and developer-friendly library for capturing media on the web. Currently, it supports:

  * 📸 **Taking Photos**
  * 📹 **Recording Videos**
  * 🎙️ **Recording Audio**

Let's dive into what makes it special.

## What Problem Does This Library Solve?

When building this, I looked around for a simple, "headless" library that just handled the *logic* of media capture without imposing any UI. 

I found many great component libraries that came with their own buttons and styles, but I couldn't find a simple, unopinionated tool that I could easily integrate into my own custom designs.

`@maukode/headless-media` is built to be that tool. It provides you with the hooks and functions to manage media capture, while you—the developer—have **100% control over the user interface**.

## Built Around Web Media Standards

This library isn't magic; it's a friendly wrapper around the powerful, standard Web APIs that are already in your browser. It primarily uses the **`MediaDevices API (getUserMedia)`** and the **`MediaRecorder API`**.

By building on these standards, we ensure the library is reliable, secure (it properly asks for user permissions), and will be supported by modern browsers for years to come. We just handle the boilerplate and state management for you, so you can focus on building your app.

## Our Design Decisions

We were very intentional about *how* we built this library. Here are the core principles we followed.

#### 1\. Why Headless?

The web development world has seen a massive rise in headless UI libraries like Headless UI and Radix. Why? Because developers want control over the look and feel of their applications without fighting a library's CSS.

We adopted the same philosophy:

  * **Total Design Freedom:** You bring the UI. Our library won't inject any styles or HTML elements you didn't ask for. Use CSS, Tailwind, Styled Components—whatever you love.
  * **Decoupled Logic:** Your app's logic for capturing media is separate from its presentation. This makes your code cleaner and easier to maintain.
  * **Small and Focused:** By not including UI code, the library stays lean and focused on doing one thing well: managing media state.

#### 2\. Why Built for Tree-Shaking?

Have you ever worried about your app's bundle size? We all have\! Tree-shaking is a process where your bundler (like Webpack or Vite) looks at your code and "shakes out" any parts of a library that you aren't actually using.

We designed `@maukode/headless-media` with this in mind. If you only need to take photos, you can just import `usePhotoCapture`. The code for video and audio recording will be completely left out of your final application, keeping it as small and fast as possible.

```ts
// You only get the code you import!
import { withPhoto, createMedia } from '@maukode/headless-media';
```

#### 3\. Why Composition over Inheritance?

This is a bit of a programming philosophy, but it has real-world benefits. Instead of creating big, complex components that you have to extend and override (inheritance), we provide small, focused pieces of logic (like hooks) that you can combine and "compose" together to build the exact feature you need.

Think of it like LEGO blocks. We give you the fundamental blocks for "starting a camera," "taking a photo," and "handling errors." You get to put them together in any way you see fit. This approach is more flexible, predictable, and easier to understand.

## What's Next on the Roadmap? 🚀

This is just the beginning\! We have a lot of exciting ideas for the future to make media on the web even easier to work with:
  * **Framework Wrapper:** Better align your favorite framework.
  * **Media Playback:** Simple hooks and utilities for playing the audio and video you've recorded.
  * **Media Manipulation:** Basic features like trimming, cropping, or applying filters directly in the browser.
  * **Media Streaming:** Exploring support for live streaming media to a server.

## Give it a Try\!

I'm incredibly excited to share `@maukode/headless-media` with you all. I believe it fills a real need for a simple, flexible, and modern media capture library for the web.

**Ready to get started?**

1.  **Install the library:**
    `npm install @maukode/headless-media`
2.  **Check out the Documentation:** [Let'es check](https://maukode.com/headless-media/getting-started/introduction/)
3.  **Explore the Code on GitHub:** [Explore the code](https://github.com/maukode/maukode-repos/tree/main/packages/headless-media)

If you build something cool with it, find a bug, or have an idea for a new feature, please open an issue or a pull request on GitHub. This is a community project, and your feedback is what will make it great.

Happy coding\!