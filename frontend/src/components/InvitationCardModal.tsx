'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Download, Printer, X, MapPin, Calendar, Users, Sparkles, Heart, ShieldCheck, Check } from 'lucide-react';
import QRCode from 'qrcode';

export interface InvitationCardData {
  guestName: string;
  inviteCode: string;
  maxGuests: number;
  tableNumber?: string;
  rsvpStatus?: string;
  inviteType?: 'CARD' | 'LINK';
}

export interface EventCardData {
  title: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  startTime?: string;
  venueName: string;
  venueAddress?: string;
  dressCode?: string;
  coverImageUrl?: string;
  couplePhotoUrl?: string;
  cardTemplate?: 'CLASSIC_HORIZONTAL' | 'ELEGANT_VERTICAL';
  cardTheme?: 'ROYAL_GOLD' | 'CHAMPAGNE_IVORY' | 'ROSE_GOLD' | 'EMERALD_GOLD';
  customWording?: string;
  slug: string;
}

interface InvitationCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: InvitationCardData | null;
  event: EventCardData | null;
}

export default function InvitationCardModal({
  isOpen,
  onClose,
  invitation,
  event,
}: InvitationCardModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [downloading, setDownloading] = useState(false);

  const cardTemplate = event?.cardTemplate || 'ELEGANT_VERTICAL';
  const theme = event?.cardTheme || 'CHAMPAGNE_IVORY';

  const brideGroomTitle = event?.brideName && event?.groomName
    ? `${event.brideName} & ${event.groomName}`
    : (event?.title || 'Wedding Celebration');

  const eventDateFormatted = event?.eventDate
    ? new Date(event.eventDate.includes('T') ? event.eventDate : event.eventDate.replace(/-/g, '/')).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : 'Upcoming Wedding Day';

  const eventDay = event?.eventDate ? new Date(event.eventDate.replace(/-/g, '/')).getDate() : 8;
  const eventMonth = event?.eventDate ? new Date(event.eventDate.replace(/-/g, '/')).toLocaleDateString('en-US', { month: 'short' }) : 'Oct';
  const eventYear = event?.eventDate ? new Date(event.eventDate.replace(/-/g, '/')).getFullYear() : 2026;

  const passTargetUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/event/${event?.slug || 'wedding'}?code=${invitation?.inviteCode || ''}&guest=${encodeURIComponent(invitation?.guestName || '')}`
    : `https://agafari.et/event/${event?.slug || 'wedding'}?code=${invitation?.inviteCode || ''}`;

  useEffect(() => {
    if (invitation?.inviteCode) {
      QRCode.toDataURL(passTargetUrl, {
        width: 450,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR code data URL:', err));
    }
  }, [invitation?.inviteCode, passTargetUrl]);

  if (!isOpen || !invitation) return null;

  const handleDownloadPNG = async () => {
    setDownloading(true);
    try {
      const qrImageSrc = qrDataUrl || await QRCode.toDataURL(passTargetUrl, {
        width: 450,
        margin: 1,
        color: { dark: '#000000', light: '#FFFFFF' },
      });

      // Template 2: Vertical Elegant Floral Card (Matching Image 2 - 1000x1500 px)
      if (cardTemplate === 'ELEGANT_VERTICAL') {
        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 1500;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Background: Warm Ivory Parchment
        ctx.fillStyle = '#FAF7F2';
        ctx.fillRect(0, 0, 1000, 1500);

        // Outer Filigree Border Frame
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 8;
        ctx.strokeRect(30, 30, 940, 1440);

        ctx.strokeStyle = 'rgba(180, 83, 9, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(42, 42, 916, 1416);

        // Corner Accents
        const drawCorner = (x: number, y: number) => {
          ctx.fillStyle = '#B45309';
          ctx.fillRect(x - 8, y - 8, 16, 16);
        };
        drawCorner(42, 42);
        drawCorner(958, 42);
        drawCorner(42, 1458);
        drawCorner(958, 1458);

        const finishVerticalCanvas = (coupleImg?: HTMLImageElement) => {
          // Top Header Wording
          ctx.fillStyle = '#9A3412';
          ctx.font = 'bold 20px serif';
          ctx.textAlign = 'center';
          ctx.fillText('INVITE YOU TO CELEBRATE', 500, 100);

          ctx.fillStyle = '#B45309';
          ctx.font = 'bold 36px serif';
          ctx.fillText('SAVE THE DATE', 500, 145);

          // Center Arch Photo Container
          const archX = 320, archY = 190, archW = 360, archH = 440;
          if (coupleImg) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(archX, archY, archW, archH, [180, 180, 20, 20]) : ctx.rect(archX, archY, archW, archH);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(coupleImg, archX, archY, archW, archH);
            ctx.restore();
          } else {
            ctx.fillStyle = '#E7E5E4';
            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(archX, archY, archW, archH, [180, 180, 20, 20]) : ctx.rect(archX, archY, archW, archH);
            ctx.fill();
          }

          // Arch Border Frame
          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(archX, archY, archW, archH, [180, 180, 20, 20]) : ctx.rect(archX, archY, archW, archH);
          ctx.stroke();

          // Couple Title Wording
          ctx.fillStyle = '#451A03';
          ctx.font = 'bold 58px serif';
          ctx.fillText(brideGroomTitle, 500, 715);

          // Date Row Format: 10:00 • 21 Sept • 2026
          ctx.fillStyle = '#92400E';
          ctx.font = 'bold 24px serif';
          const timeText = event?.startTime ? `at ${event.startTime}` : 'at 02:00 PM';
          ctx.fillText(`${timeText}  •  ${eventDay} ${eventMonth}  •  ${eventYear}`, 500, 770);

          // Venue Location
          ctx.fillStyle = '#1C1917';
          ctx.font = 'bold 26px sans-serif';
          ctx.fillText(`📍 ${event?.venueName || 'Sheraton Addis Luxury Ballroom'}`, 500, 825);

          if (event?.venueAddress) {
            ctx.fillStyle = '#57534E';
            ctx.font = '20px sans-serif';
            ctx.fillText(event.venueAddress, 500, 860);
          }

          if (event?.dressCode) {
            ctx.fillStyle = '#B45309';
            ctx.font = 'italic 20px serif';
            ctx.fillText(`👗 Dress Code: ${event.dressCode}`, 500, 905);
          }

          // Honored Guest Box
          ctx.fillStyle = '#FEF3C7';
          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 2;
          const boxX = 120, boxY = 945, boxW = 760, boxH = 190, r = 20;
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(boxX, boxY, boxW, boxH, r);
          } else {
            ctx.rect(boxX, boxY, boxW, boxH);
          }
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#92400E';
          ctx.font = 'bold 18px sans-serif';
          ctx.fillText('HONORED GUEST & FAMILY', 500, 985);

          ctx.fillStyle = '#78350F';
          ctx.font = 'bold 42px serif';
          ctx.fillText(invitation.guestName, 500, 1045);

          ctx.fillStyle = '#451A03';
          ctx.font = 'bold 22px sans-serif';
          const tableText = invitation.tableNumber ? ` • TABLE #${invitation.tableNumber}` : '';
          ctx.fillText(`ADMIT: ${invitation.maxGuests} ${invitation.maxGuests === 1 ? 'PERSON' : 'PERSONS'}${tableText}`, 500, 1100);

          // Bottom Floral Line Art Motif & Scannable QR Pass Code Stamp
          ctx.fillStyle = '#451A03';
          ctx.font = 'italic 18px serif';
          ctx.fillText('❤ Eternal Love & Sacred Blessings ❤', 360, 1260);

          // QR Code Image Stamp (Bottom Right)
          const qrImg = new Image();
          qrImg.onload = () => {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(700, 1180, 240, 250);

            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 3;
            ctx.strokeRect(700, 1180, 240, 250);

            ctx.drawImage(qrImg, 720, 1195, 200, 200);

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 16px monospace';
            ctx.fillText(`PASS #${invitation.inviteCode}`, 820, 1415);

            // Official Pass Seal Stamp
            ctx.fillStyle = '#B45309';
            ctx.fillRect(120, 1370, 520, 60);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText('✓ AGAFARI OFFICIAL INVITATION PASS', 380, 1407);

            // Trigger PNG Download
            const link = document.createElement('a');
            link.download = `Agafari_Invitation_Card_${invitation.inviteCode}_${invitation.guestName.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            setDownloading(false);
          };
          qrImg.src = qrImageSrc;
        };

        const photoSrc = event?.couplePhotoUrl || event?.coverImageUrl;
        if (photoSrc && photoSrc.startsWith('data:')) {
          const img = new Image();
          img.onload = () => finishVerticalCanvas(img);
          img.onerror = () => finishVerticalCanvas();
          img.src = photoSrc;
        } else {
          finishVerticalCanvas();
        }

      } else {
        // Template 1: Classic Horizontal Pass (1500x1000 px)
        const canvas = document.createElement('canvas');
        canvas.width = 1500;
        canvas.height = 1000;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#0B0A09';
        ctx.fillRect(0, 0, 1500, 1000);

        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 14;
        ctx.strokeRect(24, 24, 1452, 952);

        const finishHorizontalCanvas = (coupleImg?: HTMLImageElement) => {
          const photoCenterX = 300, photoCenterY = 460, photoRadius = 190;
          if (coupleImg) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(coupleImg, photoCenterX - photoRadius, photoCenterY - photoRadius, photoRadius * 2, photoRadius * 2);
            ctx.restore();
          }

          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.textAlign = 'left';
          ctx.fillStyle = '#D4AF37';
          ctx.font = 'bold 18px sans-serif';
          ctx.fillText('AGAFARI (አጋፋሪ) WEDDING INVITATION PASS', 560, 110);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 48px serif';
          ctx.fillText(brideGroomTitle, 560, 175);

          ctx.fillStyle = '#D1D5DB';
          ctx.font = 'italic 20px serif';
          ctx.fillText(event?.customWording || 'Together with their families request the pleasure of your company', 560, 215);

          // Honored Guest Box
          ctx.fillStyle = '#181512';
          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 2;
          const boxX = 560, boxY = 265, boxW = 860, boxH = 190, r = 20;
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(boxX, boxY, boxW, boxH, r);
          } else {
            ctx.rect(boxX, boxY, boxW, boxH);
          }
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#EAB308';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText('HONORED GUEST & FAMILY', 590, 305);

          ctx.fillStyle = '#FEF08A';
          ctx.font = 'bold 36px serif';
          ctx.fillText(invitation.guestName, 590, 360);

          ctx.fillStyle = '#F3F4F6';
          ctx.font = 'bold 20px sans-serif';
          const tableText = invitation.tableNumber ? ` • TABLE #${invitation.tableNumber}` : '';
          ctx.fillText(`ADMIT: ${invitation.maxGuests} ${invitation.maxGuests === 1 ? 'PERSON' : 'PERSONS'}${tableText}`, 590, 415);

          // Date & Venue Details
          ctx.fillStyle = '#F3F4F6';
          ctx.font = 'bold 22px sans-serif';
          ctx.fillText(`📅 ${eventDateFormatted} ${event?.startTime ? `at ${event.startTime}` : ''}`, 560, 500);

          ctx.fillStyle = '#FBBF24';
          ctx.font = 'bold 22px sans-serif';
          ctx.fillText(`📍 ${event?.venueName || 'Sheraton Addis Luxury Ballroom'}`, 560, 545);

          // QR Code Image
          const qrImg = new Image();
          qrImg.onload = () => {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(1160, 650, 260, 270);
            ctx.drawImage(qrImg, 1180, 665, 220, 220);

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`PASS #${invitation.inviteCode}`, 1290, 905);

            const link = document.createElement('a');
            link.download = `Agafari_Invitation_Card_${invitation.inviteCode}_${invitation.guestName.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            setDownloading(false);
          };
          qrImg.src = qrImageSrc;
        };

        const photoSrc = event?.couplePhotoUrl || event?.coverImageUrl;
        if (photoSrc && photoSrc.startsWith('data:')) {
          const img = new Image();
          img.onload = () => finishHorizontalCanvas(img);
          img.onerror = () => finishHorizontalCanvas();
          img.src = photoSrc;
        } else {
          finishHorizontalCanvas();
        }
      }

    } catch (err) {
      console.error('Error generating invitation card PNG:', err);
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 font-sans overflow-y-auto"
      >
        <div className={`w-full ${cardTemplate === 'ELEGANT_VERTICAL' ? 'max-w-md' : 'max-w-4xl'} bg-stone-950 border-2 border-amber-500 rounded-3xl p-5 sm:p-7 relative text-center text-white shadow-2xl space-y-4 my-auto overflow-hidden`}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 transition-colors border border-stone-800 cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider shadow-gold">
            <Crown className="w-4 h-4 text-slate-950" />
            <span>Official Royal Wedding Invitation Card</span>
          </div>

          {/* TEMPLATE 2: ROMANTIC FLORAL PORTRAIT CARD (Matches Reference Photo Image 2) */}
          {cardTemplate === 'ELEGANT_VERTICAL' ? (
            <div className="p-6 rounded-3xl bg-[#FAF7F2] text-stone-900 border-2 border-amber-600/40 shadow-2xl relative overflow-hidden text-center space-y-4 font-serif">
              {/* Ornate Golden Line Art Border */}
              <div className="absolute inset-3 border-2 border-amber-600/30 rounded-2xl pointer-events-none" />

              {/* Top Wording */}
              <div className="pt-2 space-y-0.5">
                <div className="text-xs text-amber-800 font-bold uppercase tracking-widest">
                  INVITE YOU TO CELEBRATE
                </div>
                <h3 className="font-serif font-bold text-2xl text-amber-900 tracking-wider uppercase">
                  SAVE THE DATE
                </h3>
              </div>

              {/* Arch Photo Container */}
              <div className="w-44 h-56 mx-auto rounded-t-full rounded-b-2xl border-4 border-amber-500/60 p-1 bg-white shadow-xl relative overflow-hidden">
                <img
                  src={event?.couplePhotoUrl || event?.coverImageUrl || '/images/hero_couple_bg.png'}
                  alt={brideGroomTitle}
                  className="w-full h-full object-cover rounded-t-full rounded-b-xl"
                />
              </div>

              {/* Couple Names in Elegant Script Wording */}
              <div className="space-y-1">
                <h2 className="font-serif font-bold text-3xl sm:text-4xl text-stone-950 tracking-wide">
                  {brideGroomTitle}
                </h2>
                <div className="text-xs text-amber-800 font-bold tracking-widest flex items-center justify-center gap-2 pt-1 font-sans">
                  <span>{event?.startTime ? `at ${event.startTime}` : 'at 02:00 PM'}</span>
                  <span>•</span>
                  <span>{eventDay} {eventMonth}</span>
                  <span>•</span>
                  <span>{eventYear}</span>
                </div>
              </div>

              {/* Venue & Location */}
              <div className="text-xs text-stone-800 space-y-0.5 font-sans">
                <div className="font-bold text-stone-900">
                  📍 {event?.venueName || 'Sheraton Addis Luxury Ballroom'}
                </div>
                {event?.venueAddress && (
                  <div className="text-[11px] text-stone-600 font-normal">
                    {event.venueAddress}
                  </div>
                )}
                {event?.dressCode && (
                  <div className="text-[11px] text-amber-800 font-medium italic pt-1 font-serif">
                    Dress Code: {event.dressCode}
                  </div>
                )}
              </div>

              {/* Honored Guest Parchment Pill */}
              <div className="p-3 rounded-2xl bg-amber-100/90 border border-amber-500/40 text-center space-y-0.5 shadow-sm font-sans">
                <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">
                  Honored Guest & Family
                </div>
                <div className="font-serif font-bold text-lg text-amber-950">
                  {invitation.guestName}
                </div>
                <div className="text-xs text-stone-800 font-bold">
                  Admit: {invitation.maxGuests} {invitation.maxGuests === 1 ? 'Person' : 'Persons'}
                  {invitation.tableNumber ? ` • Table #${invitation.tableNumber}` : ''}
                </div>
              </div>

              {/* Bottom QR Stamp & Pass Code */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-amber-600/30 text-left font-sans">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-white rounded-lg border border-amber-500 shrink-0">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="QR Pass" className="w-16 h-16" />
                    ) : (
                      <div className="w-16 h-16 bg-stone-100 flex items-center justify-center text-[9px] text-stone-500">QR</div>
                    )}
                  </div>
                  <div>
                    <div className="font-mono text-[11px] font-bold text-amber-900">PASS #{invitation.inviteCode}</div>
                    <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official Gate Pass
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TEMPLATE 1: CLASSIC HORIZONTAL PASS */
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/90 border-2 border-amber-500/60 shadow-2xl relative overflow-hidden text-left grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-3 relative z-10">
                <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 border-amber-400 p-1 bg-stone-950 relative overflow-hidden shadow-2xl">
                  <img
                    src={event?.couplePhotoUrl || event?.coverImageUrl || '/images/hero_couple_bg.png'}
                    alt={brideGroomTitle}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="text-amber-400 text-xs font-serif font-bold pt-1">
                  ❤ ROYAL WEDDING PASS ❤
                </div>
              </div>

              <div className="md:col-span-7 space-y-3.5 relative z-10">
                <div>
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">AGAFARI (አጋፋሪ) WEDDING PASS</div>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white mt-0.5">{brideGroomTitle}</h2>
                  <p className="text-xs text-stone-300 font-serif italic mt-0.5">{event?.customWording || 'Together with their families request the pleasure of your company'}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/70 border border-amber-500/40 space-y-1">
                  <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Honored Guest & Family</div>
                  <div className="font-serif font-bold text-lg text-amber-300">{invitation.guestName}</div>
                  <div className="text-xs text-stone-200 font-medium">Admit: {invitation.maxGuests} {invitation.maxGuests === 1 ? 'Person' : 'Persons'}</div>
                </div>

                <div className="space-y-1 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-bold text-white">{eventDateFormatted} {event?.startTime ? `at ${event.startTime}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-semibold text-amber-300">{event?.venueName || 'Sheraton Addis Luxury Ballroom'}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-4 border-t border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white rounded-xl border border-amber-500 shrink-0">
                      {qrDataUrl ? <img src={qrDataUrl} alt="QR Pass" className="w-16 h-16" /> : <div className="w-16 h-16 text-[9px] bg-stone-100 flex items-center justify-center text-stone-500">QR</div>}
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-amber-400">PASS #{invitation.inviteCode}</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">✓ Gate Security Verified</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleDownloadPNG}
              disabled={downloading}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-gold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 border border-amber-300"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>{downloading ? 'Generating PNG Card...' : 'Download Designed Card (.PNG)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 border border-amber-500/40 shadow-sm transition-all cursor-pointer"
              title="Print Invitation Card"
            >
              <Printer className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
