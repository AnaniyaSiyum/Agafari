export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { TemplateService } from '@/application/services/TemplateService';
import { MySqlEventRepository } from '@/infrastructure/persistence/MySqlEventRepository';
import { DomainError, ForbiddenError, NotFoundError } from '@/domain/errors/DomainError';

const templateService = new TemplateService(new MySqlEventRepository());

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { templateId, customization, lock } = await req.json();

    const updated = await templateService.updateTemplate({
      slug: params.slug,
      templateId,
      customization,
      lock,
      userId: user.userId,
      userRole: user.role,
    });

    return NextResponse.json({ success: true, event: updated.props });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Template update error:', error);
    return NextResponse.json({ error: 'Failed to update template.' }, { status: 500 });
  }
}
