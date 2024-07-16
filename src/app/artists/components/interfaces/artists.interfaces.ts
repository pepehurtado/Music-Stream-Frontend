export interface Artist {
  id:             number;
  name:           string;
  dateOfBirth:    Date;
  country:        string;
  age:            number;
  singleSongList: SingleSongList[];
  albumList:      AlbumList[];
}

export interface AlbumList {
  id:            number;
  title:         string;
  year:          string;
  artist:        number;
  description:   null | string;
  numberOfSongs: number | null;
  url:           null | string;
}

export interface SingleSongList {
  id:        number;
  title:     string;
  time:      number;
  url:       null | string;
  artists:   number[];
  album:     number | null;
  genreList: number[];
}
