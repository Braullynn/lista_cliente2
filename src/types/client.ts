export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export type NewClient = Omit<Client, 'id'> & {
  id?: number;
};