export interface MediaAsset {
  id: string;
  eventId: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  category?: 'WISHES' | 'BTS' | 'LIVE';
  cdnUrl: string;
  thumbnailUrl?: string;
  caption: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface MediaComment {
  id: string;
  mediaAssetId: string;
  authorName: string;
  commentText: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface IMediaRepository {
  findByEventId(eventId: string, category?: string): Promise<MediaAsset[]>;
  findByOrganizerId(organizerId: string): Promise<MediaAsset[]>;
  updateStatusScoped(mediaId: string, status: string, organizerId?: string): Promise<boolean>;
  deleteScoped(mediaId: string, organizerId?: string): Promise<boolean>;
  findCommentsScoped(mediaId: string, organizerId?: string): Promise<MediaComment[]>;
  updateCommentStatusScoped(commentId: string, status: string, organizerId?: string): Promise<boolean>;
  createCommentScoped(mediaId: string, authorName: string, commentText: string): Promise<MediaComment>;
}
