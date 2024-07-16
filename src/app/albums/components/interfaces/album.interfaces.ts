export interface Album {
  id:            number;
  title:         string;
  year:          string;
  artist:        number;
  description:   null | string;
  numberOfSongs: number | null;
  url:           null | string;
}
