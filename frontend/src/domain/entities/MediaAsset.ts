export interface MediaAssetProps {
  id: string;
  eventId: string;
  uploaderName: string;
  mediaType: 'IMAGE' | 'VIDEO';
  category?: 'FEED' | 'WISHES' | 'LIVE_STREAM';
  cdnUrl: string;
  caption?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  likesCount?: number;
  commentsCount?: number;
  createdAt?: string;
}

export class MediaAsset {
  public props: MediaAssetProps;

  constructor(props: MediaAssetProps) {
    if (!props.cdnUrl?.trim()) {
      throw new Error('Media asset CDN URL cannot be empty');
    }

    this.props = {
      ...props,
      uploaderName: props.uploaderName ? props.uploaderName.trim() : 'Anonymous Guest',
      status: props.status || 'PENDING',
      likesCount: Math.max(0, props.likesCount || 0),
      commentsCount: Math.max(0, props.commentsCount || 0),
    };
  }

  public get id(): string { return this.props.id; }
  public get eventId(): string { return this.props.eventId; }
  public get cdnUrl(): string { return this.props.cdnUrl; }
  public get status(): string { return this.props.status; }
  public get isApproved(): boolean { return this.props.status === 'APPROVED'; }
  public get isLiveStream(): boolean { return this.props.category === 'LIVE_STREAM'; }


  public approve(): void {
    this.props.status = 'APPROVED';
  }

  public reject(): void {
    this.props.status = 'REJECTED';
  }

  public incrementLikes(): number {
    this.props.likesCount = (this.props.likesCount || 0) + 1;
    return this.props.likesCount;
  }
}
