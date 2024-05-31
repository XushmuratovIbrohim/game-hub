import authServices from '../../services/authServices';
import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useNavigate } from 'react-router-dom'
import loadingImg from '../../assets/loading.svg'
export default function Profile() {
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        authServices.getUser()
            .then((res) => {
                setIsLoading(false)
                setUserData(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])
    return (
        <>
            {isLoading ? <Box sx={{ maxWidth: '500px', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={loadingImg} alt="loading" />
            </Box> :
                <Box sx={{ maxWidth: 500, color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' }}>
                    <MonetizationOnIcon sx={{ color: 'gold', width: '100px', height: '100px' }} />
                    <Box sx={{ color: 'gold', fontSize: '30px', fontWeight: 'bold' }}>{userData?.coins}</Box>
                    <Box component={'form'} sx={{ width: '100%', paddingTop: '50px' }}>
                        <Box component={'div'} sx={{ width: '100%', columnGap: '10px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <TextField
                                variant="outlined"
                                value={userData?.username}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            border: 'none',
                                        },
                                        '&:hover fieldset': {
                                            border: 'none',
                                        },
                                        '&.Mui-focused fieldset': {
                                            border: 'none',
                                        },
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        outline: 'none',
                                    },
                                    background: '#f5f5f5',
                                    borderRadius: '20px',
                                }}
                            />
                            <EditIcon sx={{ color: 'black', position: 'absolute', right: '25px', top: '15px' }} />
                        </Box>
                        <Box component={'div'} sx={{ width: '100%', position: 'relative', display: 'flex', columnGap: '10px', alignItems: 'center' }}>
                            <TextField
                                variant="outlined"
                                value={userData?.nickname}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            border: 'none',
                                        },
                                        '&:hover fieldset': {
                                            border: 'none',
                                        },
                                        '&.Mui-focused fieldset': {
                                            border: 'none',
                                        },
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        outline: 'none',
                                    },
                                    background: '#f5f5f5',
                                    padding: '0',
                                    marginTop: '20px',
                                    borderRadius: '20px',

                                }}
                            />
                            <EditIcon sx={{ color: 'black', position: 'absolute', right: '25px', top: '35px' }} />
                        </Box>
                        <Button variant="contained" sx={{ marginTop: '20px', width: '100%', borderRadius: '20px' }} color="success"> Success</Button>
                    </Box>
                    <Button onClick={
                        () => {
                            authServices.logout();
                            navigate('/auth/login')
                        }
                    } sx={{ '&:hover': { backgroundColor: 'red' }, marginTop: '20px', width: '100%', borderRadius: '20px', color: 'white', backgroundColor: 'red' }} >Log Out</Button>
                </Box>
            }
        </>
    );
}

