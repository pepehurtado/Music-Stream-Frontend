export interface Song {
  id:        number;
  title:     string;
  time:      number;
  url:       null | string;
  artists:   number[];
  album_name:     string | null;
  album:     number | null;
  genreList: number[];
}
