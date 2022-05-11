import { SportsVolleyball, ExpandLess, ExpandMore } from "@mui/icons-material"
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse, Card, Divider, Typography, LinearProgress } from "@mui/material"
import Box from "@mui/material/Box"
import PersonIcon from '@mui/icons-material/Person';
import { useEffect, useState } from "react";
import { Httper } from "../../utils/httper";
import { UserEntity } from "../../../../backend/src/entities/user.entity";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";

const httper = new Httper("http://localhost:3001")

export const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<UserEntity[]>([])
    const [stats, setStats] = useState<{
        users: number,
        tickets: number,
        bets: number,
        successful_tickets: number,
        successful_bets: number
    } | undefined>()
    const navigate = useNavigate();
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
                        <Divider sx={{flex:0}} orientation="vertical" variant="middle" flexItem />

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
                        <Divider sx={{flex:0}} orientation="vertical" variant="middle" flexItem />

                        <Box sx={{ p: 1 }}>
                            <Typography color='primary' variant="h5">
                                NUMBER OF BETS
                            </Typography>
                            <Box>
                                <Typography  variant="h2" sx={{ fontWeight: 'bold' }}>
                                    <CountUp duration={1} end={stats.bets}></CountUp>

                                </Typography>
                            </Box>
                        </Box>
                        <Divider sx={{flex:0}} orientation="vertical" variant="middle" flexItem />

                        <Box sx={{ p: 1 }}>
                            <Typography color='primary' variant="h5">
                                SUCCESSFUL TICKETS
                            </Typography>
                            <Box>
                                <Typography  variant="h2" sx={{ fontWeight: 'bold' }}>
                                    <CountUp duration={1} end={stats.successful_tickets}></CountUp>%

                                </Typography>
                            </Box>
                        </Box>
                        <Divider sx={{flex:0}} orientation="vertical" variant="middle" flexItem />
                        <Box sx={{ p: 1 }}>
                            <Typography color='primary' variant="h5">
                                SUCCESSFUL BETS
                            </Typography>
                            <Box>
                                <Typography  variant="h2" sx={{ fontWeight: 'bold' }}>
                                    <CountUp duration={1} end={stats.successful_bets}></CountUp>%

                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                    <Divider />
                    <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
                        <Box sx={{ borderRight: '1px solid gray', width:'30%' }}>
                            <Typography sx={{ p: 2 }} variant="h4">Users</Typography>
                            <Divider />
                            <List
                                sx={{ width: '100%', maxWidth: 360, overflow: 'hidden', bgcolor: 'background.paper' }}
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                            >
                                {
                                    users.map(user => {
                                        return (
                                            <ListItemButton>
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
                        <Box>
                            USER INFO
                        </Box>
                    </Box>
                </Box>
                :
                <LinearProgress />
            }
        </Box>
    )
}