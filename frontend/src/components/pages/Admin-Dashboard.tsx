import { SportsVolleyball, ExpandLess, ExpandMore } from "@mui/icons-material"
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse, Card, Divider, Typography, LinearProgress, Grid, CircularProgress, Button } from "@mui/material"
import Box from "@mui/material/Box"
import PersonIcon from '@mui/icons-material/Person';
import { useEffect, useState } from "react";
import { Httper } from "../../utils/httper";
import { UserEntity } from "../../../../backend/src/entities/user.entity";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { TicketEntity } from "../../../../backend/src/entities/ticket.entity";
import { TicketStatus } from "../../models/ticket-status.enum";
import { UserAccountStatus } from "../../models/user-account-status.enums";

const httper = new Httper("http://localhost:3001")

export const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<UserEntity[]>([])
    const [selectedUser, setSelectedUser] = useState<UserEntity | undefined>(undefined)
    const [selectedUserData, setSelectedUserData] = useState<UserEntity | undefined>(undefined);
    const [fetchingUserData, setFetchingUserData] = useState<boolean>(false);
    const [stats, setStats] = useState<{
        users: number,
        tickets: number,
        bets: number,
        successful_tickets: number,
        successful_bets: number
    } | undefined>()
    const navigate = useNavigate();

    const calculateNumberOfBets = (tickets: TicketEntity[], onlySuccessfulBets: boolean = false) =>{
        return tickets.reduce(function(accumulator, ticket) {
            if(onlySuccessfulBets){
                return accumulator + ticket.items.filter(item => item.status == TicketStatus.Successful).length
            }else{
                return accumulator + ticket.items.length;
            }
          }, 0);
    }

    useEffect(() =>{
        if(!selectedUser) return;
        setFetchingUserData(true);
        httper.getUserDataAdmin(selectedUser)
        .then(response => {
            setFetchingUserData(false);
            if (response.status && response.status == 200) {
                setSelectedUserData(response.payload);
            } else if (response.status && response.status == 401) {
                navigate('/signup')
            } else {
                alert("Unexpected error");
                setSelectedUser(undefined);
                console.log(response);
            }
        })
        .catch(error => {
            alert("Unexpected error");
            setFetchingUserData(false);
            setSelectedUser(undefined);
            console.log(error);
        })
    }, [selectedUser])

    const blockUser = (userId:number) =>{
        httper.blockUser(userId)
        .then(response => {
            if (response.status && response.status == 200) {
                alert('User blocked successfully')
                setSelectedUserData(response.payload)
            } else if (response.status && response.status == 401) {
                navigate('/signup')
            } else {
                setSelectedUser(undefined);
                console.log(response);
            }
        })
        .catch(error => {
            alert("Unexpected error");
            console.log(error);
        });
    }

    const unblockUser = (userId:number) =>{
        httper.unblockUser(userId)
        .then(response => {
            if (response.status && response.status == 200) {
                alert('User unblocked successfully')
                setSelectedUserData(response.payload)
            } else if (response.status && response.status == 401) {
                navigate('/signup')
            } else {
                setSelectedUser(undefined);
                console.log(response);
            }
        })
        .catch(error => {
            alert("Unexpected error");
            console.log(error);
        });
    }

    useEffect(() => {
        const getUsers = httper.getUsers;
        const getStats = httper.getStats;
        getUsers()
            .then(response => {
                if (response.status && response.status == 200) {
                    setUsers(response.payload);

                } else if (response.status && response.status == 401) {
                    navigate('/signup')
                } else {
                    alert("Unexpected error");
                    console.log(response);
                }
            })
            .catch(error => {
                alert("Unexpected error");
                console.log(error);
            })

        getStats()
            .then(response => {
                if (response.status && response.status == 200) {
                    setStats(response.payload);

                } else if (response.status && response.status == 401) {
                    navigate('/signup')
                } else {
                    alert("Unexpected error");
                    console.log(response);
                }
            })
            .catch(error => {
                alert("Unexpected error");
                console.log(error);
            })
    }, [])
    return (
        <Box>
            {stats && users && users.length > 0 ?
                <Box sx={{ height: '100vh' }}>
                    <Card sx={{ display: 'flex', '& > *': { flex: 1, textAlign: 'center' } }}>
                        <Box sx={{ p: 1 }}>
                            <Typography color='primary' variant="h5">
                                NUMBER OF USERS
                            </Typography>
                            <Box>
                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                    <CountUp duration={1} end={stats.users}></CountUp>

                                </Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ flex: 0 }} orientation="vertical" variant="middle" flexItem />

                        <Box sx={{ p: 1 }}>
                            <Typography color='primary' variant="h5">
                                NUMBER OF TICKETS
                            </Typography>
                            <Box>
                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                    <CountUp duration={1} end={stats.tickets}></CountUp>

                                </Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ flex: 0 }} orientation="vertical" variant="middle" flexItem />

                        <Box sx={{ p: 1 }}>
                            <Typography color='primary' variant="h5">
                                NUMBER OF BETS
                            </Typography>
                            <Box>
                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                    <CountUp duration={1} end={stats.bets}></CountUp>

                                </Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ flex: 0 }} orientation="vertical" variant="middle" flexItem />

                        <Box sx={{ p: 1 }}>
                            <Typography color='primary' variant="h5">
                                SUCCESSFUL TICKETS
                            </Typography>
                            <Box>
                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                    <CountUp duration={1} end={stats.successful_tickets}></CountUp>%

                                </Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ flex: 0 }} orientation="vertical" variant="middle" flexItem />
                        <Box sx={{ p: 1 }}>
                            <Typography color='primary' variant="h5">
                                SUCCESSFUL BETS
                            </Typography>
                            <Box>
                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                    <CountUp duration={1} end={stats.successful_bets}></CountUp>%

                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                    <Divider />
                    <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
                        <Box sx={{ borderRight: '1px solid gray', width: '30%' }}>
                            <Typography sx={{ p: 2 }} variant="h4">Users</Typography>
                            <Divider />
                            <List
                                sx={{ width: '100%', overflow: 'hidden', bgcolor: 'background.paper' }}
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                            >
                                {
                                    users.map(user => {
                                        return (
                                            <ListItemButton key={user.id} onClick={() => setSelectedUser(user)} sx={{ width: '100%', backgroundColor: user == selectedUser ? 'primary.light' : 'initial' }}>
                                                <ListItemIcon>
                                                    <PersonIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={user.username} secondary={`${user.name}`} />
                                            </ListItemButton>
                                        )
                                    })
                                }

                            </List>
                        </Box>
                        <Box sx={{width:'100%', p:2}}>
                            {
                                fetchingUserData ? <CircularProgress style={{position:'absolute', left:'50%', top:'50%', width:'220px', height:'220px'}} color="primary" /> : <></>
                            }
                            {selectedUser && selectedUserData &&
                                <Grid container sx={{width:'100%'}} spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography variant="h6">Name</Typography>
                                        <Divider />
                                        <Typography variant="h5" color="primary.main">{selectedUserData.name}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="h6">Number of tickets</Typography>
                                        <Divider />
                                        <Typography variant="h3" color="primary.main">
                                            <CountUp duration={1} end={selectedUserData.tickets.length}></CountUp>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="h6">Username</Typography>
                                        <Divider />
                                        <Typography variant="h5" color="primary.main">{selectedUserData.username}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="h6">Number of bets</Typography>
                                        <Divider />
                                        <Typography variant="h3" color="primary.main">
                                            <CountUp duration={1} end={calculateNumberOfBets(selectedUserData.tickets)}></CountUp>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="h6">Email</Typography>
                                        <Divider />
                                        <Typography variant="h5" color="primary.main">{selectedUserData.email}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="h6">Successful tickets</Typography>
                                        <Divider />
                                        <Typography variant="h3" color="primary.main">
                                            <CountUp duration={1} end={(selectedUserData.tickets.filter(ticket => ticket.status == TicketStatus.Successful).length*100)/selectedUserData.tickets.length}></CountUp>%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="h6">Balance</Typography>
                                        <Divider />
                                        <Typography variant="h3" color="primary.main">{(+selectedUserData._balance).toFixed(2)}$</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="h6">Successful bets</Typography>
                                        <Divider />
                                        <Typography variant="h3" color="primary.main">
                                            <CountUp duration={1} end={(calculateNumberOfBets(selectedUserData.tickets, true)*100)/calculateNumberOfBets(selectedUserData.tickets)}></CountUp>%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sx={{mt:5}}>
                                        {selectedUserData.accountStatus == UserAccountStatus.ACTIVE ? 
                                            <Button onClick={() => blockUser(selectedUser.id)} variant="contained" sx={{backgroundColor: "error.main", color:'white'}}>Block user</Button>
                                            :
                                            <Button onClick={() => unblockUser(selectedUser.id)} variant="contained" sx={{backgroundColor: "primary.main", color:'white'}}>Unblock user</Button>

                                        }
                                    </Grid>
                                </Grid>
                            }
                        </Box>
                    </Box>
                </Box>
                :
                <LinearProgress />
            }
        </Box>
    )
}