import { MatchModel } from './../../../backend/src/models/soccer-bet/match.model';
import { MasterDataModel, CompetitionData } from './../../../backend/src/models/soccer-bet/master-data.model';
import { ResponseModel } from '../../../backend/src/models/response.model';
import * as RequestModels from '../../../backend/src/models/requests/register.request';
import { UserProfileData } from '../../../backend/src/models/responses/UserProfileData.response';
import { TransactionPurpose } from '../../../backend/src/models/transaction-purpose.enum';
import { TicketItemModel } from '../models/ticket.model';
export class Httper {


    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;

        // this.get('/healt').then(response => {
        //     console.log(response)
        // }).catch(error => {
        //     console.log(error)
        // })
    }

    private post = async <T>(route: string, body: any, options?: any): Promise<ResponseModel<T>> => {
        const response = await fetch(this.baseUrl + route, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        return await response.json();
    }

    private get = async <T>(route: string, options?: any): Promise<ResponseModel<T>> => {
        const response = await fetch(this.baseUrl + route, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            ...options
        })

        return await response.json();
    }

    public getMasterData = async () => {
        const response = await this.get<MasterDataModel>('/get-master-data')
        return response.payload
    }

    public getUserProfileData = async () => {
        const response = await this.get<UserProfileData>('/user-profile-data')
        return response
    }

    public getMatchesForCompetition = async (competition: CompetitionData) => {
        const response = await this.get<MatchModel[]>(`/get-matches/${competition.Id}`)
        return response.payload
    }

    public login = async (username: string, password: string) => {
        const response = await this.post('/login', { username, password });
        return response;
    }

    public register = async (registerModel: RequestModels.Register) => {
        const response = await this.post('/register', registerModel);
        return response;
    }

    public getUserData = async () => {
        const response = await this.get('/userData');
        return response;
    }

    public makeTransaction = async (obj: { transactionPurpose: TransactionPurpose, value: number }) => {
        const response = await this.post('/make-transaction', obj);
        return response;
    }

    public submitTicket = async (ticket: { selectedBets: TicketItemModel[] }, ticketAmount: number) => {
        const response = await this.post('/submit-ticket', { ticket, ticketAmount })
        return response;
    }
}
