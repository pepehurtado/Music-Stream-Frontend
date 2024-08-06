export interface PermissionTranslater {
  id:          number;
  permission:  Permission;
  language:    string;
  translation: string;
}


export interface Permission {
  id:           number;
  name:         Name;
  entity:       Entity;
  translations: any[];
}

export enum Entity {
  Artist = "artist",
  Song = "song",
}

export enum Name {
  Read = "read",
  Write = "write",
}
