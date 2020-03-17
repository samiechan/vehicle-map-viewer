import { Vehicle } from './vehicle';

export interface User {
    userid: number;
    owner: {
        name: string;
        surname: string;
        foto: string;
    };
    vehicles: Vehicle[];
}