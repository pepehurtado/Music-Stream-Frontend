export interface User {
  id:         number;
  username:   string;
  email:      string;
  password:   string;
  image:      string;
  active:     number;
  softDelete: number;
  createdAt:  Date;
  updatedAt:  Date;
  roles:      Role[];
}

export interface Role {
  id:          number;
  name:        string;
  permissions: Permission[];
}

export interface Permission {
  id:     number;
  name:   Name;
  entity: string;
}

export enum Name {
  Read = "read",
  Write = "write",
}
