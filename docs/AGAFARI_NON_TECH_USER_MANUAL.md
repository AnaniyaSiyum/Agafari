# 👑 AGAFARI (አጋፋሪ) — Complete Plain-English User Manual
### The Ultimate Step-by-Step Guide for Non-Technical Users, Admins, Planners, Couples & Guests

---

## 🌟 Welcome to Agafari!
**Agafari** is a modern digital wedding ecosystem designed to replace slow, expensive paper invitation cards with smart, digital passes, live streaming, interactive guest video reels, and secure gate scanning.

**No technical background or coding skills are needed.** This manual explains every screen, every button, and every workflow in simple, clear steps.

---

## 📑 Table of Contents
1. [The 6 People & Roles in Agafari](#1-the-6-people--roles-in-agafari)
2. [Flow 1: System Super Admin (Platform Owner)](#2-flow-1-system-super-admin-platform-owner)
3. [Flow 2: Event Organizing Agencies (Wedding Planners)](#3-flow-2-event-organizing-agencies-wedding-planners)
4. [Flow 3: The Bride & Groom (Couple Suite)](#4-flow-3-the-bride--groom-couple-suite)
5. [Flow 4: Invited Guests (RSVP & Digital QR Pass)](#5-flow-4-invited-guests-rsvp--digital-qr-pass)
6. [Flow 5: Gate Security (Scanning QR Passes at the Door)](#6-flow-5-gate-security-scanning-qr-passes-at-the-door)
7. [Flow 6: Live Streaming Crew (Broadcasting to the Diaspora)](#7-flow-6-live-streaming-crew-broadcasting-to-the-diaspora)
8. [Flow 7: Media Moderator (Approving Photos & Wishes)](#8-flow-7-media-moderator-approving-photos--wishes)
9. [Quick Reference: All Website Links & Default Logins](#9-quick-reference-all-website-links--default-logins)
10. [Frequently Asked Questions & Troubleshooting](#10-frequently-asked-questions--troubleshooting)

---

## 1. The 6 People & Roles in Agafari

| Role | Who Are They? | What Can They Do? | Where Do They Log In? |
| :--- | :--- | :--- | :--- |
| **👑 Super Admin** | Platform Owner / Agafari Management | Creates agencies, approves weddings, sets guest quotas, sees full system statistics. | `/admin/login` or `/admin/dashboard` |
| **🏢 Organizer** | Wedding Planning Agency | Creates and licenses weddings for their clients, tracks all hosted weddings. | `/organizer/login` or `/organizer/dashboard` |
| **💍 Couple** | Bride & Groom | Uploads photos, chooses song/theme, invites guests, sets table quotas, monitors RSVPs. | `/couple/dashboard` |
| **🎟️ Guest** | Invited Family & Friends | Opens link on WhatsApp/Telegram, confirms attendance (RSVP), shows QR pass at entrance. | Invitation Link (No login needed) |
| **📱 Gate Scanner** | Venue Door Security Guard | Scans guest QR codes on their phone in 2 seconds to prevent uninvited crashers. | `/scanner` |
| **🎥 Live Streamer** | Videographer / Media Team | Broadcasts live ceremony video to diaspora relatives with real-time floating reactions. | `/live-streamer` |

---

## 2. Flow 1: System Super Admin (Platform Owner)

### Goal: Manage the entire platform, onboard wedding agencies, license weddings, and control quotas.

### Step-by-Step Instructions:
1. **Accessing the Portal:**
   * Open your browser and go to: `https://agafarii.com/admin/login`
   * Enter your admin credentials (e.g., `admin@agafari.com` / `admin123`).
   * Click **Sign In to Super Admin**.

2. **Creating a New Organizing Agency:**
   * In the top-right header, click **"+ Add Organizing Agency"**.
   * Fill in the Agency Details:
     * **Agency Name:** (e.g., *Royal Habesha Events*)
     * **Owner Full Name:** (e.g., *Senait Bekele*)
     * **Login Email:** (e.g., *senait@royalhabesha.com*)
     * **Password:** Create a temporary password for them (e.g., *agency2026*).
     * **Phone Number:** Agency contact phone.
   * Click **"Save & Provision Agency"**.
   * **Result:** The agency account is immediately active. They can log in from `/organizer/login` and only see their own weddings.

3. **Creating a Direct Wedding (Single Couple License):**
   * Click the golden **"👑 Create & License Wedding Event"** button.
   * Fill in:
     * Bride's Name & Groom's Name (e.g., *Sara Tadesse & Dawit Alemayehu*)
     * Wedding Date & Venue Name (e.g., *Sheraton Addis Grand Ballroom*)
     * Couple's Login Email (e.g., *sara.dawit@agafari.com*)
     * Expected Guests / Headcount Quota (e.g., *300*)
     * Optional Couple Photo (must be clean JPEG/PNG/WebP, max 5MB).
   * Click **"Submit & Provision License"**.
   * **Result:** A success popup appears with:
     * **Direct Wedding Dashboard Link:** `https://agafarii.com/couple/dashboard?slug=sara-and-dawit-2026`
     * Couple Login Email & Password (`agafari2026`).
     * 1-Click button: **"Open Wedding Dashboard"**.

4. **Approving or Rejecting Agency Wedding Requests:**
   * When an organizing agency submits a new wedding, it appears under the **"Pending Approval"** tab.
   * Click **"Approve & Issue License"** to activate it, or **"Reject"** with feedback if details are incomplete.

---

## 3. Flow 2: Event Organizing Agencies (Wedding Planners)

### Goal: Manage all your client weddings from one clean agency control room.

### Step-by-Step Instructions:
1. **Logging In:**
   * Open: `https://agafarii.com/organizer/login`
   * Enter your agency email and password.
   * Click **"Enter Organizer Dashboard"**.

2. **Viewing Your Agency Fleet:**
   * Your agency name appears on the left sidebar.
   * You will see cards for all weddings assigned to your agency:
     * **🟢 Active Hosting:** Current upcoming weddings.
     * **🟡 Pending Admin:** Requests waiting for platform admin licensing.
     * **📜 Hosted Archive:** Past completed weddings.

3. **Submitting a New Client Wedding:**
   * Click the **"Request Wedding License & Couple Access"** tab.
   * Enter the Bride and Groom's names, wedding date, ballroom venue, and couple email.
   * Click **"Submit Request to Admin"**.
   * **Result:** The wedding is registered. Once approved, you can click on its card at any time to open its full dashboard.

4. **Opening Any Wedding Dashboard:**
   * Simply click on any wedding card in your directory.
   * **Result:** It instantly opens that wedding's control center (`/couple/dashboard?slug=...`) with full access to guest lists, seating headcount, invitations, and photos.

---

## 4. Flow 3: The Bride & Groom (Couple Suite)

### Goal: Prepare your digital invitation, invite guests, download QR passes, choose music, and approve guest photos.

### Step-by-Step Instructions:
1. **Logging In:**
   * Open: `https://agafarii.com/couple/dashboard?slug=your-wedding-slug` (or `/couple/login`).
   * Enter the couple email and password provided by your planner.

2. **Tab 1: Wedding Setup & Appearance (Left Menu: "Wedding Setup"):**
   * **Cover & Portrait Photo:** Click to upload your best portrait photo (used on your invitation cards and digital screens).
   * **Background Song:** Choose a romantic instrumental or Mezmur track that plays when guests open your digital invitation.
   * **Invitation Card Template:** Choose between:
     * *Elegant Vertical Style* (perfect for smartphone screens).
     * *Classic Horizontal Style* (traditional gold-bordered card).
   * **Theme Palette:** Choose Royal Gold, Champagne Ivory, Rose Gold, or Emerald.
   * Click **"Save Settings"**.

3. **Tab 2: Inviting Guests (Left Menu: "Guests & RSVPs"):**
   * Look at your **Headcount Counter** (e.g., *150 / 300 Seats Claimed*).
   * Click **"+ Add Guest Invitation"**.
   * Enter:
     * **Guest Name:** (e.g., *Uncle Tesfaye & Family*)
     * **Phone Number:** (Optional, for SMS/Telegram tracking)
     * **Allowed Headcount:** (e.g., *2* for couple, *4* for family).
   * Click **"Generate Invitation Pass"**.
   * **Result:** A unique digital invitation card with an anti-copy QR code is created instantly!

4. **Sharing the Invitation with the Guest:**
   * Click the **"Share / QR Pass"** button next to the guest's name.
   * Click **"Copy WhatsApp / Telegram Invite Link"**.
   * Send the link directly to that guest on Telegram or WhatsApp.

5. **Tab 3: Photos, Wishes & Music (Left Menu: "Media & Wishes"):**
   * Review text messages and video wishes sent by your guests.
   * Click **"Approve"** on any photo or video you want to show on the public wedding feed or venue projection screens.

---

## 5. Flow 4: Invited Guests (RSVP & Digital QR Pass)

### Goal: Guest receives invitation, confirms attendance, and shows their pass at the gate.

### Step-by-Step Experience (Zero Tech Required):
1. **Guest Receives a Message on Telegram/WhatsApp:**
   * Example: *"You are cordially invited to celebrate the wedding of Sara & Dawit! Tap here to view your royal invitation and gate pass: https://agafarii.com/event/sara-and-dawit-2026?invite=abc123xyz"*

2. **Opening the Digital Invitation:**
   * The guest taps the link on their phone.
   * Beautiful wedding music plays automatically.
   * The animated golden invitation card opens with their personal name: *"Dear Uncle Tesfaye & Family, You are invited for 2 Seats."*
   * Below the card, they see the interactive countdown clock, hotel venue address, and Google Maps direction button.

3. **Confirming Attendance (1-Click RSVP):**
   * The guest taps **"✓ Will Attend"** or **"✕ Respectfully Decline"**.
   * If attending, they select how many people from their allowed seats will come (e.g., *2*).
   * **Result:** The couple's dashboard is instantly updated. No food or catering seats are wasted!

4. **Saving the Gate Entry QR Pass:**
   * The guest taps **"Show My Digital Entry Pass"**.
   * A high-contrast QR code appears on their screen showing:
     * Guest Name
     * Number of Allowed Entrants
     * Unique Security Badge
   * They can save it to their phone photos or keep the webpage open when arriving at the venue.

---

## 6. Flow 5: Gate Security (Scanning QR Passes at the Door)

### Goal: Door guards scan guests in 2 seconds, verify headcount, and prevent fake screenshots or uninvited crashers.

### Step-by-Step Instructions:
1. **Opening the Scanner on Guard's Phone:**
   * Open Chrome/Safari and visit: `https://agafarii.com/scanner`
   * Allow camera permissions when prompted.

2. **Scanning a Guest:**
   * Hold the phone camera over the guest's QR pass on their phone screen or printed card.
   * In less than 1 second, the screen beeps and shows one of two results:

   * **🟢 GREEN — VALID ENTRY:**
     * Shows: *"Sara Tadesse & Family — 2 Guests Admitted"*
     * Security guard lets 2 people enter and taps **"Confirm Entry"**.

   * **🔴 RED — ALREADY SCANNED / INVALID:**
     * If someone took a screenshot of someone else's pass and tried to use it again, the scanner displays:
     * *"⚠️ Pass Already Used at 3:15 PM by Door Guard 1 (Anti-Passback Protected)"*.
     * Guard stops the duplicate entry immediately.

---

## 7. Flow 6: Live Streaming Crew (Broadcasting to the Diaspora)

### Goal: Stream the church and ballroom ceremonies live to family members in the US, Europe, and Canada.

### Step-by-Step Instructions:
1. **Accessing the Studio:**
   * Open: `https://agafarii.com/live-streamer`
   * Enter your live stream credentials.

2. **Connecting Video Source:**
   * You can stream directly from a smartphone browser camera or connect your professional camera via YouTube Live / RTMP embed.
   * Click **"Start Live Broadcast"**.

3. **What Diaspora Guests See:**
   * Remote relatives open `https://agafarii.com/event/sara-and-dawit-2026/live` on their phone, iPad, or smart TV.
   * They watch in HD quality with zero lag.
   * They can tap floating hearts, clapping, and champagne emojis to cheer the bride and groom from across the ocean!

---

## 8. Flow 7: Media Moderator (Approving Photos & Wishes)

### Goal: Filter guest photo uploads before displaying them on the ballroom LED screens.

### Step-by-Step Instructions:
1. **Opening the Moderation Hub:**
   * Open: `https://agafarii.com/moderation`
   * Log in with moderator credentials.

2. **Reviewing Incoming Photos & Reels:**
   * When guests at tables upload selfies, dance clips, or video blessings from the memory feed, they appear in the **Pending Queue**.
   * Click **"✓ Approve"** to show it on the live projector screen.
   * Click **"✕ Reject"** if a photo is blurry, duplicate, or inappropriate.

---

## 9. Quick Reference: All Website Links & Default Logins

| Destination | Web Link | Default Username | Default Password |
| :--- | :--- | :--- | :--- |
| **Platform Homepage** | `https://agafarii.com/` | *(Public)* | *(None)* |
| **System Super Admin** | `https://agafarii.com/admin/login` | `admin@agafari.com` | `admin123` |
| **Organizer Agencies** | `https://agafarii.com/organizer/login` | Agency Email | Assigned by Admin |
| **Wedding Dashboard** | `https://agafarii.com/couple/dashboard` | Couple Email | `agafari2026` |
| **Gate QR Scanner** | `https://agafarii.com/scanner` | `scanner@agafari.com` | `scan123` |
| **Live Stream Studio** | `https://agafarii.com/live-streamer` | `streamer@agafari.com` | `stream123` |
| **Media Moderation** | `https://agafarii.com/moderation` | `moderator@agafari.com` | `mod123` |

*(Note: In production, always change default passwords to custom secure passwords via the dashboard).*

---

## 10. Frequently Asked Questions & Troubleshooting

#### Q: Do guests need to download an app from Google Play or App Store?
**A: NO.** Agafari is 100% web-based. Guests open the link directly in Telegram, WhatsApp, Safari, or Chrome without installing anything.

#### Q: What if a guest does not have internet at the venue gate?
**A: No problem.** The guest can take a screenshot of their QR pass at home while connected to Wi-Fi. The door security scanner can scan the screenshot effortlessly.

#### Q: Can someone share their QR code with friends so uninvited people enter?
**A: No.** Agafari has **Anti-Passback technology**. As soon as a pass is scanned at the door, the database marks it as "Entered". If a second person shows the same QR pass 5 minutes later, the scanner flashes red and displays "Already Used".

#### Q: How do I change the wedding date or venue location after creating the event?
**A: Easy.** Log in to the Wedding Dashboard (`/couple/dashboard`), navigate to **"Wedding Setup"**, change the date or venue address, and click **"Save Settings"**. All guest links update automatically in real-time.

---

*© 2026 Agafari (አጋፋሪ) by Hamelmal Creatives. All rights reserved.*
