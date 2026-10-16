'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import OrganizerDashboardView from '@/components/organizer/OrganizerDashboardView';

export default function SpecificOrganizerPage() {
  const params = useParams();
  const organizerId = params?.id ? String(params.id) : '';

  return <OrganizerDashboardView organizerId={organizerId} />;
}
