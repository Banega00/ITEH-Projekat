import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import LinearProgress from "@mui/material/LinearProgress"
import OutlinedInput from "@mui/material/OutlinedInput"
import Typography from "@mui/material/Typography"
import moment from "moment"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserProfileData } from '../../../../backend/src/models/responses/UserProfileData.response'
import { TransactionPurpose } from "../../models/transaction-purpose.enum"
import { Httper } from "../../utils/httper"
import { TicketCarousel } from "../TicketCarousel"

const httpService = new Httper('http://localhost:3001')
export const Profile = () => {
    const [userProfileData, setUserProfileData] = useState<UserProfileData>()
    const [dialogsState, setDialogState] = useState<{ payInDialog: boolean, withdrawDialog: boolean }>({ payInDialog: false, withdrawDialog: false })

    //card info 
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [transactionValue, setTransactionValue] = useState(0);
    const [refreshUserProfile, setRefreshUserProfile] = useState(false);


    const [transactionLinearProgress, setTransactionLinearProgress] = useState(false);



    const navigate = useNavigate();

    const validateCardNumber = (cardNumber:string) => {
        let length = 0;
        for (var i = 0; i < cardNumber.length; i++) {
            if(cardNumber.charAt(i) == ' '){
            }
            else if(!isNaN(+cardNumber.charAt(i))){
                length++;
            }else{
                return 'Only digits are allowed in card number'
            }
          }
        if(length!=16) return 'Card Number has to be 16 characters long'
        return '';
    }

    const handleDialogClose = (dialogType: keyof typeof dialogsState) => {
        if (dialogType == 'payInDialog') {
            setDialogState({ ...dialogsState, payInDialog: false })
        } else if (dialogType == 'withdrawDialog') {
            setDialogState({ ...dialogsState, withdrawDialog: false })
        }
    }

    const payin = () =>{
        if(transactionValue <= 0){
            alert('Transaction amount must be greater than 0')
            return;
        }
        const validationMessage = validateCardNumber(cardNumber)
        if(validationMessage){
            alert(validationMessage)
            return;
        }
        if(cardNumber && expiryDate && cvv){
            setTransactionLinearProgress(true)

            httpService.makeTransaction({transactionPurpose: TransactionPurpose.PAYIN, value: transactionValue})
            .then(response=>{
                if(response.status==200){
                    setTimeout(
                        function() {
                            setRefreshUserProfile(!refreshUserProfile)
                            setDialogState({ ...dialogsState, payInDialog: false })
                            setTransactionLinearProgress(false)
                        }
                        .bind(this),
                        2000
                    );
                }else{
                    alert("Error making transaction")
                    console.log(response)
                }
            })
            .catch(error=>{
                alert("Error making transaction")
                console.log(error)
            })
        }else{
            alert("Invalid card information")
            setDialogState({ ...dialogsState, payInDialog: false })
        }
    }

    const withdraw = () =>{
        if(transactionValue <= 0){
            alert('Transaction amount must be greater than 0')
            return;
        }
        const validationMessage = validateCardNumber(cardNumber)
        if(validationMessage){
            alert(validationMessage)
            return;
        }
        if(userProfileData && transactionValue > userProfileData.balance){
            alert('Not enough money to withdraw this amount')
            return;
        }
        if(cardNumber){
            setTransactionLinearProgress(true)

            httpService.makeTransaction({transactionPurpose: TransactionPurpose.WITHDRAW, value: transactionValue - 2*transactionValue})
            .then(response=>{
                if(response.status==200){
                    setTimeout(
                        function() {
                            setRefreshUserProfile(!refreshUserProfile)
                            setDialogState({ ...dialogsState, withdrawDialog: false })
                            setTransactionLinearProgress(false)
                        }
                        .bind(this),
                        2000
                    );
                }else{
                    alert("Error making transaction")
                    console.log(response)
                }
            })
            .catch(error=>{
                alert("Error making transaction")
                console.log(error)
            })

        }else{
            alert("Invalid card information")
            setDialogState({ ...dialogsState, withdrawDialog: false })
        }
    }

    useEffect(() => {
        const getUserProfileData = async () => httpService.getUserProfileData();
        getUserProfileData().then(response => {
            if (response.status == 200) {
                setUserProfileData(response.payload)
            } else if (response.status == 401) {
                navigate('/signup')
            } else {
                console.log("Unexpected error: ", response)
            }
        }).catch(error => {
            console.log("Unexpected error: ", error)
        })
    }, [refreshUserProfile])
    return (
        <div>
            {userProfileData ? <Box>
                <Card elevation={24}>
                    <Typography variant='h2' color={'primary'}>
                        PROFILE
                    </Typography>
                </Card>
                <Box sx={{ height: '600px', display: 'flex' }}>
                    <Box sx={{ p: 2, flex: 1 }}>
                        <Typography variant='h3' color={'primary'}>
                            Profile Info
                        </Typography>
                        <FormControl disabled sx={{ width: '100%', margin: '20px 0', '& .Mui-disabled': { color: (theme) => theme.palette.primary.dark } }} variant="outlined">
                            <InputLabel htmlFor="login-username-input">Username</InputLabel>
                            <OutlinedInput
                                id="login-username-input"
                                value={userProfileData.username}
                                sx={{ fontSize: '1.5rem', '& .Mui-disabled': { color: 'red' } }}
                                label="Username"
                            />
                        </FormControl>
                        <FormControl disabled sx={{ margin: '20px 0', width: '100%', '& .Mui-disabled': { color: (theme) => theme.palette.primary.dark } }} variant="outlined">
                            <InputLabel htmlFor="login-username-input">Name</InputLabel>
                            <OutlinedInput
                                id="login-username-name"
                                value={userProfileData.name}
                                sx={{ fontSize: '1.5rem', '& .Mui-disabled': { color: 'red' } }}
                                label="Username"
                            />
                        </FormControl>
                        <FormControl disabled sx={{ width: '100%', margin: '20px 0', '& .Mui-disabled': { color: (theme) => theme.palette.primary.dark } }} variant="outlined">
                            <InputLabel htmlFor="login-username-input">Email</InputLabel>
                            <OutlinedInput
                                id="login-username-email"
                                value={userProfileData.email}
                                sx={{ fontSize: '1.5rem', '& .Mui-disabled': { color: 'red' } }}
                                label="Username"
                            />
                        </FormControl>
                    </Box>
                    <Divider sx={{ flex: 0, height: '90%', margin: 'auto', borderRightWidth: 2 }} orientation='vertical' />
                    <Box sx={{ flex: 1, p: 2, overflow: 'hidden', width: 'fit-content', position: 'relative' }}>
                        <Typography variant='h3' color={'primary'}>
                            Tickets
                        </Typography>
                        <TicketCarousel tickets={[undefined]} />

                    </Box>
                    <Divider sx={{ flex: 0, height: '90%', margin: 'auto', borderRightWidth: 2 }} orientation='vertical' />

                    <Box sx={{ flex: 1, p: 2 }}>
                        <Typography variant='h3' color={'primary'}>
                            Balance
                        </Typography>
                        <Typography variant='h2' sx={{ color: 'black', textAlign: 'center', p: 2 }}>
                            {`${userProfileData.balance.toFixed(2)}$`}
                        </Typography>

                        <Box sx={{ widht: '100%', display: 'flex' }}>
                            <Button onClick={() => setDialogState({ ...dialogsState, payInDialog: true })} variant="contained" sx={{ flex: 1, widht: '200px', m: 1, color: 'white' }}>Pay in</Button>
                            <Button onClick={() => setDialogState({ ...dialogsState, withdrawDialog: true })} variant="contained" sx={{ flex: 1, widht: '200px', m: 1, color: 'white' }}>Withdraw</Button>
                        </Box>

                        <Divider />

                        <Box sx={{ maxHeight: '300px', pr: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                            <Typography variant='h5' sx={{ color: 'black', p: 1 }}>
                                Transaction history
                            </Typography>
                            {userProfileData.transactions.map(transaction => {
                                return (
                                    <Card sx={{ display: 'flex', mb: 1, width: '100%', backgroundColor: 'lightgray' }}>
                                        <Box sx={{ width: '100%' }}>
                                            <Box sx={{ backgroundColor: transaction.value > 0 ? 'primary.light' : 'error.light', p: 1, pb: 0 }}>{moment(transaction.date).format('DD.MM.yyyy - HH:mm')}</Box>
                                            <Box sx={{ backgroundColor: transaction.value > 0 ? 'primary.light' : 'error.light', p: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                                <Box sx={{ color: 'white', fontSize: '1.5em' }}>{transaction.value.toFixed(2)}$</Box>
                                                <Box sx={{ fontSize: '1.2em', marginLeft: 'auto', mr: 2 }}>{transaction.transactionPurpose}</Box>
                                            </Box>
                                        </Box>

                                    </Card>
                                )
                            })}
                        </Box>
                    </Box>
                </Box>
            </Box> :
                <LinearProgress color="primary" />}



            <Dialog open={dialogsState.payInDialog}>
                <DialogTitle>Pay in money</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To invest money in your account you'll have to provide your credit card information
                    </DialogContentText>
                    <Box>
                        <Divider />

                        <FormControl sx={{ mt:1, mb:1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="transaction-value-input">Amount</InputLabel>
                            <OutlinedInput
                                id="transaction-value-input"
                                value={transactionValue}
                                required
                                onChange={(event) => setTransactionValue(+event.target.value)}
                                placeholder="100$"
                                label="Card Number"
                            />
                        </FormControl>

                        <FormControl sx={{ mt:1, mb:1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="card-number-input">Card number</InputLabel>
                            <OutlinedInput
                                id="card-number-input"
                                value={cardNumber}
                                required
                                onChange={(event) => setCardNumber(event.target.value)}
                                placeholder="1234 5678 1234 5678"
                                label="Card Number"
                            />
                        </FormControl>

                        <FormControl sx={{ mt:1, mb:1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="expiry-date-input">Expiry date</InputLabel>
                            <OutlinedInput
                                id="expiry-date-input"
                                value={expiryDate}
                                required
                                onChange={(event) => setExpiryDate(event.target.value)}
                                placeholder="MM/YY"
                                label="Expiry date"
                            />
                        </FormControl>

                        <FormControl sx={{ mt:1, mb:1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="cvv-input">CVC/CVV</InputLabel>
                            <OutlinedInput
                                id="cvv-input"
                                value={cvv}
                                required
                                onChange={(event) => setCvv(event.target.value)}
                                placeholder="123"
                                label="CVC/CVV"
                            />
                        </FormControl>
                        <LinearProgress sx={{display: transactionLinearProgress ? 'block' : 'none' }} color="success" />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => payin()}>Pay in</Button>
                    <Button onClick={() => handleDialogClose('payInDialog')}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dialogsState.withdrawDialog}>
                <DialogTitle>Withdraw money</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To withdraw money from your account you'll, please provide credit card information which you want to transfer money to
                    </DialogContentText>
                    <Box>
                        <Divider />
                        <FormControl sx={{ mt:1, mb:1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="transaction-value-input">Amount</InputLabel>
                            <OutlinedInput
                                id="transaction-value-input"
                                value={transactionValue}
                                required
                                onChange={(event) => setTransactionValue(+event.target.value)}
                                placeholder="100$"
                                label="Card Number"
                            />
                        </FormControl>
                        <FormControl sx={{ mt:1, mb:1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="card-number-input">Card number</InputLabel>
                            <OutlinedInput
                                id="card-number-input"
                                value={cardNumber}
                                required
                                onChange={(event) => setCardNumber(event.target.value)}
                                placeholder="1234 5678 1234 5678"
                                label="Card Number"
                            />
                        </FormControl>
                        <LinearProgress sx={{display: transactionLinearProgress ? 'block' : 'none' }} color="success" />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => withdraw()}>Withdraw</Button>
                    <Button onClick={() => handleDialogClose('withdrawDialog')}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}