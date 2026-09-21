export interface WishProps {
  id: string;
  eventId: string;
  senderName: string;
  message: string;
  mediaType?: 'TEXT' | 'AUDIO' | 'VIDEO';
  videoUrl?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isFeatured?: boolean;
  createdAt?: string;
}

export class Wish {
  public props: WishProps;

  constructor(props: WishProps) {
    if (!props.senderName?.trim()) {
      throw new Error('Sender name cannot be empty');
    }
    if (!props.message?.trim()) {
      throw new Error('Wish message cannot be empty');
    }
    if (props.message.length > 2000) {
      throw new Error('Wish message exceeds maximum length of 2000 characters');
    }

    this.props = {
      ...props,
      senderName: props.senderName.trim(),
      message: props.message.trim(),
      mediaType: props.mediaType || 'TEXT',
      status: props.status || 'PENDING',
      isFeatured: props.isFeatured || false,
    };
  }

  public get id(): string { return this.props.id; }
  public get eventId(): string { return this.props.eventId; }
  public get senderName(): string { return this.props.senderName; }
  public get message(): string { return this.props.message; }
  public get status(): string { return this.props.status; }
  public get isApproved(): boolean { return this.props.status === 'APPROVED'; }

  public approve(): void {
    this.props.status = 'APPROVED';
  }

  public reject(): void {
    this.props.status = 'REJECTED';
  }
}
