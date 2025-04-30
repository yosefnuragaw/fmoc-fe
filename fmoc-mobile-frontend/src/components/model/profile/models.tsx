
export type Area = {
    subClusterName: string | null;
    clusterName: string | null;
    rmaName: string | null;
    operatorName: string | null;
};


export type UserData = {
    name: string;
    role: string;
    email: string;
    area: Area;
    saldo: number | null;
    nomorRekening: string | null;
    nomorMobil: string | null;
    nomorGenset: string | null;
};