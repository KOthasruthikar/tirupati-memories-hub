// Database types for members and gallery
export interface DbMember {
  uid: string;
  name: string;
  role: string;
  memory: string;
  bio: string;
  profile_image: string;
  created_at: string;
}

export interface DbGalleryImage {
  id: string;
  src: string;
  caption: string | null;
  owner_uid: string;
  uploaded_at: string;
}
