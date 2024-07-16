export interface Album {
  id:              number;
  description:     null | string;
  number_of_songs: number | null;
  title:           string;
  url:             null | string;
  year:            string;
  artist_id:       number;
}
