---
title: Building Photobooth App with Electron and `@maukode/headless-media`
date: 2025-08-23
tags:
  - headless-ui
  - media
  - headless-media
  - electron
---

**From Library to Reality: Building an Electron Photobooth App with `@maukode/headless-media`**

In my last post, I introduced you to my new library, [`@maukode/headless-media`](https://www.npmjs.com/package/@maukode/headless-media). It's always one thing to build a tool, but the real test comes when you use it to create something real, with real-world requirements and deadlines.
<!-- excerpt -->
Well, I recently got the chance to do just that! A client asked me to build a custom, desktop-based photobooth application, and I knew it was the perfect opportunity to put my own library to the test.

While I can't share the client's proprietary code, I can walk you through the journey, the thought process, and how the core principles of [`@maukode/headless-media`](https://www.npmjs.com/package/@maukode/headless-media) were not just theoretical but crucial to the project's success.

## The Project Vision: A Modern Desktop Photobooth

The goal was to create a simple, elegant photobooth that could run on a desktop computer for events. The user experience had to be seamless:

1.  **Live Preview:** Users walk up and immediately see themselves on a large screen.
2.  **Simple Capture:** A big, friendly on-screen button (or a physical button) triggers a countdown.
3.  **The "Flash":** A visual effect simulates a camera flash when the photo is taken.
4.  **Branded Result:** The final photo is displayed with the event's custom branding and overlays.
5.  **Save/Print:** The user can then save or print their photo.

The key requirement was that the entire user interface needed to be **fully custom-branded**—from the buttons to the countdown animation and the final image frame.

## Why Electron? And Why a Web Library?

We chose **Electron** to build the desktop app. For those new to it, [Electron](https://www.electronjs.org/) allows you to build cross-platform desktop applications using web technologies: HTML, CSS, and JavaScript. Essentially, your app is a supercharged website running in its own dedicated window.

This is exactly why [`@maukode/headless-media`](https://www.npmjs.com/package/@maukode/headless-media) was a perfect fit. Even though the final product is a desktop app, the core technology is still the web's rendering engine (Chromium). My library, built on standard Web APIs, could work inside [Electron](https://www.electronjs.org/) right out of the box.

## The Perfect Match: How `@maukode/headless-media` Shined

This is where the design decisions I talked about in the last post paid off in a huge way.

#### 1. "Headless" was a Lifesaver for Custom UI

This was the single most important factor. The client had a very specific vision for the UI. A traditional media library with pre-built buttons, modals, or camera views would have been a nightmare. We would have spent more time overriding its styles than building the actual feature.

Because [`@maukode/headless-media`](https://www.npmjs.com/package/@maukode/headless-media) is headless, I just imported the logic.

* The live camera feed was just a standard `<video>` tag that I styled with CSS.
* The "Take Photo" button was a custom-built React component with unique animations.
* The countdown was a series of full-screen overlays I designed.

I simply "plugged" the library's functions (`start`, `takePhoto`) into my own components. There was zero friction between the logic and the custom UI we needed to build.

#### 2. Composition for a Step-by-Step Flow

A photobooth experience is a sequence of states: `Idle` -> `Countdown` -> `Flash` -> `Preview`.

The composable nature of the library made managing this flow incredibly clean. I didn't have one giant, complex component. Instead, I used the functions from the library as building blocks within the app's state machine.

Here’s a conceptual breakdown of the flow:

1.  **Idle State:** On app launch, I called `start()` to display the live preview on the `<video>` element. The app is now waiting for user interaction.
2.  **Countdown State:** When a user hits the "Take Photo" button, the app's state changes to `countdown`. A 3, 2, 1 animation plays on screen. The camera is still running.
3.  **Capture & Flash:** At the end of the countdown, I called the `takePhoto()` function. In the same moment, I triggered a simple CSS animation to make the screen flash white.
4.  **Preview State:** The `photo` variable provided by hook now contains the image data. My app detects this change and switches the UI to the `preview` state, showing the captured photo on screen.

This step-by-step approach, powered by the simple functions from the library, was flexible and incredibly easy to reason about.

## Final Thoughts: A Successful Real-World Test

Building this photobooth was a fantastic experience. It proved that the core principles behind [`@maukode/headless-media`](https://www.npmjs.com/package/@maukode/headless-media) hold up under the pressure of a real client project. 

By focusing on being headless and composable, the library enabled me to build a fully custom, performant application faster than I could have otherwise.

It did its job perfectly: it handled the complexities of the media device APIs, and then it got out of the way, giving me the freedom to build the exact experience my client wanted.

I hope this gives you some ideas for how you might use it in your own projects!

Happy building!