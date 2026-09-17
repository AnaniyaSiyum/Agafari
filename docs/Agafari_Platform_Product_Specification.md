# AGAFARI (አጋፋሪ) - ETHIOPIAN WEDDING PLATFORM
## Enterprise Systems Architecture & Product Specification Manual
**Document Version**: 2.0.0  
**Domain Scope**: Ethiopian Wedding Operations, Digital Gatekeeping, Real-Time Logistics & Community Engagement  
**Architectural Standard**: ISO/IEC/IEEE 42010 Enterprise Blueprint  

---

## 1. Document Control & Architectural Governance

| Attribute | Specification Detail |
|---|---|
| **Platform Identifier** | Agafari (አጋፋሪ) Event Intelligence System |
| **Document Purpose** | Definitive Functional & Architectural Master Blueprint |
| **Target Audience** | Enterprise Planners, Lead Systems Engineers, Event Directors, Product Managers |
| **Core Philosophy** | Cultural Enhancement & Logistical Friction Elimination |
| **Deployment Model** | Mobile-First Progressive Web App (PWA) + Distributed Cloud Engine |

---

## 2. Executive Vision & Cultural Philosophy

### 2.1 The Cultural Preservation Imperative
Ethiopian weddings (*ሰርግ*) are among the most culturally rich, sacred, and communal celebrations in the world. They represent the union not merely of two individuals, but of extended families, communities, and traditions spanning generations. From the morning Kebele/Home preparations and groom's procession (*ሚዜ እና መራሽ*), to church ceremonies, traditional blessings, hall receptions, and the *Melse* (*መልስ*), Ethiopian wedding customs embody unmatched warmth and hospitality (*እንግዳ ተቀባይነት*).

**Agafari (አጋፋሪ)** is explicitly built on the foundational principle of **enhancing traditional Ethiopian weddings without altering or eliminating their cultural essence**. Technology must never sanitize or mechanize the warmth of Ethiopian hospitality; rather, it must eliminate the chaotic operational bottlenecks, administrative confusion, and logistical friction that cause severe stress for the bride, groom, and organizers.

### 2.2 Strategic Objectives
1. **Frictionless Hospitality**: Elevate guest reception by replacing lost paper cards and door confusion with dignified, instant digital entry.
2. **Quota & Delegation Clarity**: Empower families to delegate invitations to relatives (*"አንቺ/አንተ 10 ካርድ ይሰጣቹሃል"*) with total visibility into RSVPs and door turnout.
3. **Timeline Transparency**: Keep guests informed of real-time program shifts (e.g. photo session extensions) to eliminate blind waiting outside venues.
4. **Community Memory Capture**: Collect candid, authentic moments from guests' perspectives alongside the official photographer's staged shots.
5. **Event Planner Professionalization**: Provide wedding coordinators with actionable guest feedback and quantitative metrics to continuously refine service quality.

---

## 3. Ethiopian Wedding Friction Spectrum (Domain Analysis)

| Friction Domain | Traditional Cause | Real-World Operational Failure | Agafari Architectural Solution |
|---|---|---|---|
| **Invitation & Delegation Blackholes** | Physical cards distributed via family members without central tracking. | Host families give 10 physical cards to an elder with zero visibility into who is invited or attending. Gate overcrowding or empty tables occur. | **Delegated Quota Engine**: Tracks family allocations, guest names, RSVPs, and dynamic QR passes in real time. |
| **Gate Confusion & Over-Capacity** | Manual paper list checking or unmanaged door entry. | Gate crashes, lost paper cards, argument at the hall entrance, and capacity safety risks. | **Instant Gate Scanner App**: <1 second encrypted QR scanning with live headcount tally and security authorization. |
| **Photo Delays & Timeline Dissolution** | Photography sessions extending past scheduled times without guest communication. | Guests arrive at the hall on schedule but sit blindly for hours waiting for the couple to arrive. Frustration degrades event mood. | **Dynamic Timeline & Delay Dispatcher**: Live schedule feed with push notifications informing guests of actual hall opening times. |
| **Single-Perspective Memory Loss** | Exclusive reliance on official videographers/photographers for event capture. | Formal shots miss intimate, joyful, and hilarious moments captured on guests' personal mobile phones. | **TikTok-Style "Loved Ones' Perspective" Wall**: Community media feed for short candid clips, photos, and video wishes. |
| **Organizer Quality Evaluation Void** | Lack of structured post-event guest feedback channels. | Organizers cannot systematically measure guest satisfaction regarding food, ambiance, music, or coordination. | **Organizers Feedback & Performance Suite**: Post-event guest rating loop generating actionable performance analytics. |

---

## 4. Professional Staff Roles & Stakeholder Taxonomies

Agafari defines strict Role-Based Access Control (RBAC) across seven distinct stakeholder profiles to ensure seamless coordination:

```
                               ┌──────────────────────────────────┐
                               │     SYSTEM SUPERADMINISTRATION   │
                               └────────────────┬─────────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 │                                                             │
    ┌────────────┴────────────┐                                   ┌────────────┴────────────┐
    │ EVENT ORGANIZER / LEAD  │                                   │   BRIDE & GROOM HOSTS   │
    │   WEDDING PLANNER       │                                   │                         │
    └────────────┬────────────┘                                   └────────────┬────────────┘
                 │                                                             │
   ┌─────────────┼─────────────┐                                 ┌─────────────┼─────────────┐
   │             │             │                                 │             │             │
┌──┴──────┐ ┌────┴─────┐ ┌─────┴────┐                         ┌──┴──────┐ ┌────┴─────┐ ┌─────┴────┐
│ GATE    │ │ DOOR     │ │ MEDIA    │                         │ FAMILY  │ │ VIP     │ │ GENERAL  │
│ SCANNER │ │ SECURITY │ │ MODERATOR│                         │ QUOTA   │ │ GUESTS  │ │ GUESTS   │
│ STAFF   │ │ HEAD     │ │          │                         │ DELEGATES│ │         │ │          │
└─────────┘ └──────────┘ └──────────┘                         └─────────┘ └─────────┘ └──────────┘
```

### 4.1 Professional Role Definitions

1. **Lead Event Planner / Organizer (`EVENT_ORGANIZER`)**:
   * Responsible for overall event configuration, venue details, master timeline publishing, vendor management, and post-event analytics inspection.
2. **Gate Security Head & Scanner Staff (`GATE_SCANNER`)**:
   * Stationed at venue entrances equipped with the Agafari Scanner App. Scans guest QR passes, verifies allowed headcounts, and manages door flow.
3. **Bride & Groom Host Admins (`BRIDE_GROOM`)**:
   * Full access to invitation lists, family quota allocations, RSVP dashboards, and moderation of guest media uploads.
4. **Family Quota Delegates (`QUOTA_DELEGATE`)**:
   * Designated family elders or representatives who receive a bulk quota of invitations (e.g. 10 or 20 passes) to assign directly to their invited branch of relatives.
5. **Media Curator & Content Moderator (`MEDIA_MODERATOR`)**:
   * Reviews guest-uploaded videos, photos, and wishes on the Community Media Wall before public display.
6. **Invited Guests (`GUEST`)**:
   * Accesses digital invitation, venue GPS directions, dynamic schedule timeline, mobile check-in pass, and community media upload portal.
7. **System Administrator (`SYSTEM_ADMIN`)**:
   * Oversees platform infrastructure, tenant isolation, security audit logging, and global system health.

---

## 5. System Architecture & Technical Foundations

### 5.1 Technology Stack Standards
* **Frontend Framework**: Next.js 14 (App Router) with TypeScript & Vanilla CSS for high-performance mobile UI.
* **Database Layer**: SQLite / PostgreSQL with Pragmatic Schema Isolation & Distributed Caching.
* **Authentication Engine**: JWT-based session security with Role-Based Route Guards.
* **QR Engine**: AES-256 HMAC Encrypted Payload Generation & Instant Camera Decoding.
* **Offline Synchronization Engine**: LocalStorage + Service Worker Queue for uninterrupted gate scanning during network drops.

### 5.2 System Data Flow Architecture

```
[GUEST PHONE / LINK] ────> [DELEGATED QUOTA ENGINE] ────> [DYNAMIC QR GENERATOR]
                                                                  │
                                                                  ▼
[GATE SCANNER APP]  <─── [OFFLINE SYNC CACHE] <──── [ENCRYPTED QR PASS]
        │
        ▼
[REAL-TIME HEADCOUNT COUNTER] ───> [ORGANIZER & COUPLE DASHBOARD]
```

---

## 6. Detailed Modular Functional Specifications

### Module 1: Digital Gatekeeping & Quota Management Engine

#### 6.1 Quota-Based Family Delegation
To honor the traditional practice where parents and elders are allocated blocks of invitation cards (*"አንቺ/አንተ 10 ካርድ ይሰጣቹሃል 10 ሰው ጥሩ"*), Agafari introduces **Delegated Quota Allocation**:
* Organizers/Couples create a **Quota Group** assigned to a specific representative (e.g., *Aunt Almaz - 15 Guests*).
* The representative receives a unique management link allowing them to input the names and phone numbers of their 15 invited guests, or forward individual invitation passes directly to them.
* Real-time RSVP statuses (*ATTENDING*, *DECLINED*, *PENDING*) aggregate back to the main host dashboard automatically.

#### 6.2 Dynamic QR Pass Generation
* Each confirmed guest or family unit receives a dynamic mobile pass containing:
  * Guest / Family Name
  * Invitation Code & Encrypted Security Hash
  * Permitted Headcount (e.g., *Max 2 Persons*)
  * Venue Name & Date
* **Note on Seating Policy**: The Agafari platform intentionally **omits specific seat/chair assignments**. Guests are welcomed into the venue according to traditional Ethiopian open-hospitality seating customs, while the system strictly controls total door headcount capacity.

#### 6.3 Offline-Resilient Gate Scanner App
* Staff at the entrance open the Agafari Gate Scanner PWA.
* Scanning takes **<800ms** per pass.
* Upon scan, the app displays:
  * `[VALID]` - Guest Name, Allowed Headcount, Check-in Button.
  * `[ALREADY SCANNED]` - Warning timestamp showing when the pass was previously checked in.
  * `[INVALID]` - Unrecognized or unapproved pass.
* Scanner app operates seamlessly offline, caching scan records locally and auto-syncing with the server when connectivity resumes.

---

### Module 2: Real-Time Program Timeline & Delay Dispatcher

#### 6.4 Dynamic Program Schedule
The event schedule is maintained live by the lead organizer:
1. *Kebele / Home Preparation & Blessings* (Morning)
2. *Groom Procession & Arrival* (Midday)
3. *Church / Ceremony Service* (Afternoon)
4. *Hall Entry & Reception Opening* (Late Afternoon)
5. *Dinner Service & Toasts* (Evening)
6. *Cutting of Cake & First Dance* (Night)
7. *Melse Preparation & Program* (Following Day)

#### 6.5 Live Delay Alert System
* During Ethiopian weddings, photo sessions frequently extend beyond allocated time slots. 
* Rather than leaving guests to wait outside the hall in confusion, the Lead Organizer triggers a **Timeline Adjustment**:
  * E.g., *"Photo session extended by 45 mins. Hall doors will open at 4:30 PM."*
* Instantly updates the guest-facing Live Schedule and dispatches push notifications / SMS alerts to keep guests informed.

#### 6.6 GPS Navigation & Organizer Directory
* One-tap interactive mapping links for venue locations (Church, Hall, Melse venue).
* Emergency contact directory listing assigned wedding coordinators, gate security leads, and transport managers.

---

### Module 3: "Loved Ones' Perspective" Community Media Wall

#### 6.7 TikTok-Style Vertical Media Feed
* A dedicated mobile media portal where guests upload candid moments captured on their smartphones during the wedding.
* Supports short video clips (up to 60 seconds), high-resolution photos, and written video wishes.
* Displays in a modern, vertical full-screen swipeable feed customized with the couple's wedding branding.

#### 6.8 Memory Curation & Moderation Suite
* Content uploaded by guests passes through a **Moderation Queue**:
  * Organizers or designated Media Moderators approve posts before they appear on the public wall.
* Ensures the couple receives a rich, authentic collection of personal moments from loved ones across every table without inappropriate content.
* Ability to download the complete raw media repository post-wedding in high resolution.

---

### Module 4: Event Organizer Evaluation & Quality Analytics

#### 6.9 Post-Event Guest Feedback Loop
* At the conclusion of the event, guests receive a prompt or scan a feedback QR to rate their experience across key service dimensions:
  * Venue Ambiance & Cleanliness
  * Food & Beverage Quality
  * Music & Entertainment
  * Entry & Door Coordination
  * Overall Event Satisfaction
* Ratings are submitted anonymously with optional guest comments.

#### 6.10 Vendor Performance & Portfolio Dashboard
* Organizers access a private analytics dashboard summarizing performance scores.
* Enables planners to evaluate third-party vendors (caterers, sound engineers, decorators) based on quantitative guest feedback.
* High-performing organizers build verified performance credentials to present to future prospective clients.

---

## 7. End-to-End Operational Lifecycle Playbook

```
PHASE 1: PRE-WEDDING (WEEKS 1 - 4)
├─ 1. Create Event & Configure Master Timeline
├─ 2. Define Family Quota Groups & Delegate Links
└─ 3. Collect RSVPs & Issue Dynamic QR Passes

PHASE 2: WEDDING DAY (MORNING - DOOR ENTRY)
├─ 1. Deploy Gate Scanner Staff with Offline PWA
├─ 2. Track Live Gate Check-ins & Headcount Tally
└─ 3. Dispatch Timeline Delay Alerts if Photos Run Late

PHASE 3: HALL RECEPTION & EVENING
├─ 1. Guests Upload Candid Videos/Photos to Community Wall
├─ 2. Media Moderator Approves Uploads for Live Feed
└─ 3. Guests Access Program Timeline & Emergency Contacts

PHASE 4: POST-WEDDING & ANALYTICS
├─ 1. Collect Anonymous Guest Feedback & Service Ratings
├─ 2. Generate Vendor Performance Analytics Report
└─ 3. Export High-Res "Loved Ones' Perspective" Media Archive
```

---

## 8. Master Entity Relationship & Data Schemas

```sql
-- Core Events Table
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    bride_name TEXT NOT NULL,
    groom_name TEXT NOT NULL,
    event_date DATETIME NOT NULL,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    status TEXT CHECK(status IN ('DRAFT', 'LIVE', 'COMPLETED', 'ARCHIVED')) DEFAULT 'DRAFT',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Family Quota Allocation Table
CREATE TABLE quota_groups (
    id TEXT PRIMARY KEY,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    delegate_name TEXT NOT NULL,
    delegate_phone TEXT NOT NULL,
    allocated_quota INTEGER NOT NULL,
    used_quota INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Guest Invitations Table (No Chair Assignment)
CREATE TABLE invitations (
    id TEXT PRIMARY KEY,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    quota_group_id TEXT REFERENCES quota_groups(id),
    guest_name TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    max_guests INTEGER DEFAULT 1,
    rsvp_status TEXT CHECK(rsvp_status IN ('PENDING', 'ATTENDING', 'DECLINED')) DEFAULT 'PENDING',
    qr_code_hash TEXT UNIQUE NOT NULL,
    is_scanned BOOLEAN DEFAULT FALSE,
    scanned_count INTEGER DEFAULT 0,
    scanned_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Program Timeline & Delay Tracking Table
CREATE TABLE timeline_events (
    id TEXT PRIMARY KEY,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    scheduled_time DATETIME NOT NULL,
    estimated_time DATETIME NOT NULL,
    status TEXT CHECK(status IN ('UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED')) DEFAULT 'UPCOMING',
    delay_reason TEXT,
    order_index INTEGER NOT NULL
);

-- Community Media Feed ("Loved Ones' Perspective")
CREATE TABLE community_posts (
    id TEXT PRIMARY KEY,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    uploader_name TEXT NOT NULL,
    media_type TEXT CHECK(media_type IN ('IMAGE', 'VIDEO')) NOT NULL,
    media_url TEXT NOT NULL,
    caption TEXT,
    status TEXT CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED')) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Post-Event Guest Feedback Table
CREATE TABLE organizer_feedback (
    id TEXT PRIMARY KEY,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    rating_ambiance INTEGER CHECK(rating_ambiance BETWEEN 1 AND 5),
    rating_catering INTEGER CHECK(rating_catering BETWEEN 1 AND 5),
    rating_coordination INTEGER CHECK(rating_coordination BETWEEN 1 AND 5),
    rating_overall INTEGER CHECK(rating_overall BETWEEN 1 AND 5),
    comments TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 9. Security, Privacy & Reliability Blueprint

1. **Pass Tamper Proofing**: QR code hashes are signed using HMAC-SHA256 with an event-specific secret key, preventing pass forgery or unauthorized headcount inflation.
2. **Privacy Protection**: Guest phone numbers and personal invitation data are encrypted at rest and never shared with third-party advertisers.
3. **High Door Throughput**: Gate scanner software is optimized for processing **>45 scans per minute per scanner device**, preventing queues at venue entrances.
4. **Resilient Data Persistence**: Gate check-in logs write synchronously to SQLite WAL / PostgreSQL logs with local PWA redundancy.

---

## 10. Summary Matrix: Traditional vs. Agafari Architecture

```
TRADITIONAL ETHIOPIAN WEDDING           AGAFARI ENTERPRISE SOLUTION
──────────────────────────────────────────────────────────────────────────────────
Lost paper invitation cards        ──>  Dynamic HMAC-Signed QR Mobile Passes
Unmonitored family card handouts   ──>  Quota-Managed Delegation Engine ("10-Card Quota")
Gate crashes & door confusion      ──>  <1s Scanner Verification & Real-Time Headcount Counter
Blind waiting due to photo delays  ──>  Live Dynamic Timeline & Delay Alert Push System
Photos trapped on personal phones  ──>  TikTok-Style "Loved Ones' Perspective" Community Feed
Unrated organizer service quality  ──>  Structured Post-Event Guest Feedback & Vendor Analytics
```
