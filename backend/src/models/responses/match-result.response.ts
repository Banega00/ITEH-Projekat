export interface MatchResulstResponse {
    mec_uzivos: {[sportShortNameString: string]: SingleMatchResult[]}
    mec_najavas: {[sportShortNameString: string]: SingleMatchResult[]};
    mec_zavrsenos: {[sportShortNameString: string]: SingleMatchResult[]};
    timestamp: any;
    igracs: any;
    leagues: {
        count: number,
        league_value: number,
        vrsta: string,//FD
        liga: string //naziv lige
    }[]
}

export interface SingleMatchResult {
    iks: string,
    d_ck: number,
    razlog_prekida: null,
    ch: null,
    liga: string,
    domacin: string,
    gost: string,
    g_k: number,
    d_s3: number,
    d_s1: number,
    kec: string,
    g_p: number,
    dan_vreme: string,
    d_s5: number,
    g_s3: number,
    g_s2: number,
    g_s1: number,
    vrsta: string,
    sifra: number,
    d_s4: number,
    vreme:Date
    g_s4: number,
    prekid: number,
    predao: number,
    poslednja_promena_ck_pen:Date,
    minut: number,
    poslednja_promena:Date,
    g_s5: number,
    poslednja_promena_statusa:Date,
    g_pen: number,
    d_pen: number,
    d_p: number,
    status: number,
    dva: string,
    odlozen: number,
    d_k: number,
    d_s2: number,
    period: string,
    betradar_id:number,
    g_ck:number,
    servis:number,
    pos_gol:number
}