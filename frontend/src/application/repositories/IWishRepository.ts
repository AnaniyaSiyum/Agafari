export interface Wish {
  id: string;
  eventId: string;
  senderName: string;
  message: string;
  mediaType?: 'TEXT' | 'VIDEO';
  videoUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface IWishRepository {
  findByEventId(eventId: string): Promise<Wish[]>;
  findByOrganizerId(organizerId: string): Promise<Wish[]>;
  updateStatusScoped(wishId: string, status: string, organizerId?: string): Promise<boolean>;
  deleteScoped(wishId: string, organizerId?: string): Promise<boolean>;
  create(wish: Partial<Wish>): Promise<Wish>;
}
