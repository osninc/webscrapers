import { ThemeProvider } from "@emotion/react"
import { Grid, AppBar, Box, Checkbox, Link, Button, CssBaseline, GlobalStyles, FormControl, FormControlLabel, Input, InputLabel, Toolbar, Typography, Container, Menu, MenuItem,Select, Slider, Snackbar, Stack } from "@mui/material"
import { defaultTheme } from "../constants/theme.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import { BUILD, DATASTORETYPE, PROXYTYPE, SCRAPER, iconButtonFAStyle, } from "../constants/constants.js";

import PropTypes from 'prop-types';
import { useAuth } from "../routes/AuthProvider";

import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from "react";


import TextField from '@mui/material/TextField';


const Layout = ({ children, title, onChangeDebugMenu }) => {
    const isTestingSite = document.location.hostname.includes("sunburst") || document.location.hostname.includes("localhost")
    const searchParams = new URLSearchParams(document.location.search);
    const hasDebugMenu = searchParams.has("debugMenu")
    const hasBuildOnQS = searchParams.has("build")

    const {
        user,
        logout,
        openLogin,
        openSignup,
        openProfile,
        isLoading
    } = useAuth();

    const [debugOptions, setDebugOptions] = useState({
        buildNumber: hasBuildOnQS ? searchParams.get("build") : BUILD,
        scraper: SCRAPER[0],
        proxyType: PROXYTYPE[0],
        maxConcurrency: 50,
        dataSavingStoreType: DATASTORETYPE[0],
        forceCleanSessionsCreation: false,
        useOutseta: false
    })


    const [anchorEl, setAnchorEl] = useState(null);

    const handleChangeDebugMenu = (e, key) => {
        setDebugOptions(prev => {
            return {
                ...debugOptions,
                [key]: e.target.value
            }
        })
    }

    const handleCheckbox = (event, key) => {
        setDebugOptions(prev => {
            return {
                ...debugOptions,
                [key]: event.target.checked
            }
        })
    };

    const openDebugMenu = Boolean(anchorEl);
    const handleDebugClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDebugClose = () => {
        setAnchorEl(null);
    };


    const handleSliderChange = (event, newValue) => {
        setDebugOptions(prev => {
            return {
                ...debugOptions,
                maxConcurrency: newValue
            }
        })
    };

    const handleInputChange = (event) => {
        setDebugOptions(prev => {
            return {
                ...debugOptions,
                maxConcurrency: event.target.value === '' ? 0 : Number(event.target.value)
            }
        })
    };

    const handleBlur = () => {
        if (debugOptions.maxConcurrency < 1) {
            setDebugOptions(prev => {
                return {
                    ...debugOptions,
                    maxConcurrency: 1
                }
            })
        } else if (debugOptions.maxConcurrency > 50) {
            setDebugOptions(prev => {
                return {
                    ...debugOptions,
                    maxConcurrency: 50
                }
            })
        }
    };

    useEffect(() => {
        if (onChangeDebugMenu)
            onChangeDebugMenu(debugOptions)
    }, [debugOptions])
    

    return (
        <ThemeProvider theme={defaultTheme}>
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
            <CssBaseline />
            <AppBar
                position="static"
                color="transparent"
                elevation={0}
            >
                <Toolbar sx={{ flexWrap: 'wrap' }} variant="dense">
                    <Link
                        component={RouterLink}
                        to="/"
                        underline="none"
                        sx={{ my: 1, mx: 1.5 }}
                    >
                        <Typography variant="h6" color="black" noWrap sx={{ flexGrow: 1 }}>
                            <FontAwesomeIcon icon={icon({ name: 'bullseye' })} fixedWidth color={defaultTheme.palette.primary.main} />
                            Land Stats Logo
                        </Typography>
                    </Link>
                    {isTestingSite && (
                        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                            (Testing Site)
                        </Typography>
                    )}
                    <nav>
                        {hasDebugMenu && (
                            <>
                                <Button
                                    id="basic-button"
                                    onClick={handleDebugClick}
                                >
                                    Debug Menu
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={openDebugMenu}
                                    onClose={handleDebugClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem>
                                        <Stack spacing={2}>
                                            <TextField
                                                id="outlined-error"
                                                label="Build Number"
                                                size="small"
                                                InputProps={{
                                                    startAdornment: <FontAwesomeIcon icon={icon({ name: 'hammer' })} />,
                                                }}
                                                defaultValue={BUILD}
                                                value={debugOptions.buildNumber}
                                                onChange={(e) => handleChangeDebugMenu(e, "buildNumber")}
                                            />
                                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                                <InputLabel id="demo-simple-select-helper-label">Select Scraper</InputLabel>
                                                <Select
                                                    labelId="demo-select-small-label"
                                                    id="demo-select-small"
                                                    value={debugOptions.scraper}
                                                    label="Select scraper"
                                                    onChange={(e) => handleChangeDebugMenu(e, "scraper")}
                                                >
                                                    {SCRAPER.map(scraper => (
                                                        <MenuItem value={scraper} key={scraper}>{scraper}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                                <InputLabel id="demo-simple-select-helper-label">Select Proxy</InputLabel>
                                                <Select
                                                    labelId="demo-select-small-label"
                                                    id="demo-select-small"
                                                    value={debugOptions.proxyType}
                                                    label="Select proxy"
                                                    onChange={(e) => handleChangeDebugMenu(e, "proxyType")}
                                                >
                                                    {PROXYTYPE.map(proxy => (
                                                        <MenuItem value={proxy} key={proxy}>{proxy}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                                <InputLabel id="demo-simple-select-helper-label">Select Datastore Type</InputLabel>
                                                <Select
                                                    labelId="demo-select-small-label"
                                                    id="demo-select-small"
                                                    value={debugOptions.dataSavingStoreType}
                                                    label="Select Datastore Type"
                                                    onChange={(e) => handleChangeDebugMenu(e, "dataSavingStoreType")}
                                                >
                                                    {DATASTORETYPE.map(store => (
                                                        <MenuItem value={store} key={store}>{store}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <Box sx={{ width: 250 }}>
                                                <Typography id="input-slider" gutterBottom>
                                                    Maximum Concurrency
                                                </Typography>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs>
                                                        <Slider
                                                            max={50}
                                                            min={1}
                                                            value={typeof debugOptions.maxConcurrency === 'number' ? debugOptions.maxConcurrency : 1}
                                                            onChange={handleSliderChange}
                                                            aria-labelledby="input-slider"
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Input
                                                            value={debugOptions.maxConcurrency}
                                                            size="small"
                                                            onChange={handleInputChange}
                                                            onBlur={handleBlur}
                                                            inputProps={{
                                                                step: 1,
                                                                min: 1,
                                                                max: 50,
                                                                type: 'number',
                                                                'aria-labelledby': 'input-slider',
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            <FormControlLabel control={<Checkbox checked={debugOptions.forceCleanSessionsCreation} onChange={(e) => handleCheckbox(e,"forceCleanSessionsCreation")} size="small" />} label="Force Clean Sessions Creation" />
                                            <FormControlLabel control={<Checkbox checked={debugOptions.useOutseta} onChange={(e) => handleCheckbox(e, "useOutseta")} size="small" />} label="Use Outseta" />
                                        </Stack>
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                        <Link
                            variant="button"
                            color="primary"
                            component={RouterLink}
                            to="/runs"
                            underline="none"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            Run stats
                        </Link>
                        <Link
                            component={RouterLink}
                            variant="button"
                            color="primary"
                            to="/features"
                            underline="none"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            Features
                        </Link>
                        <Link
                            component={RouterLink}
                            variant="button"
                            color="primary"
                            to="/pricing"
                            underline="none"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            Pricing
                        </Link>
                        <Link
                            component={RouterLink}
                            variant="button"
                            color="primary"
                            to="/faq"
                            underline="none"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            FAQ's
                        </Link>
                        <Link
                            variant="button"
                            color="primary"
                            component={RouterLink}
                            to="/about"
                            underline="none"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            About Us
                        </Link>
                    </nav>
                    {user && (
                        <>
                            <Button variant="contained" sx={{ my: 1, mx: 1.5 }} onClick={openProfile}>
                                <FontAwesomeIcon icon={icon({ name: 'user' })} fixedWidth style={iconButtonFAStyle} />
                                {user.FullName} Profile
                            </Button>
                            <Button variant="contained" sx={{ my: 1, mx: 1.5 }} onClick={logout}>
                                <FontAwesomeIcon icon={icon({ name: 'right-from-bracket' })} fixedWidth style={iconButtonFAStyle} />
                                Logout
                            </Button>
                        </>
                    )}

                    {!user && !isLoading && (
                        <>
                            <Button variant="contained" sx={{ my: 1, mx: 1.5 }} onClick={openLogin}>
                                <FontAwesomeIcon icon={icon({ name: 'right-to-bracket' })} fixedWidth style={iconButtonFAStyle} />
                                Login
                            </Button>
                            <Button variant="contained" sx={{ my: 1, mx: 1.5 }} onClick={openSignup}>
                                <FontAwesomeIcon icon={icon({ name: 'user-pen' })} fixedWidth style={iconButtonFAStyle} />
                                Signup
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            {/* Hero unit */}
            <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
                <Typography
                    component="h2"
                    variant="h2"
                    align="center"
                    color="primary"
                    gutterBottom
                >
                    {title}
                </Typography>
            </Container>
            {/* End hero unit */}
            {children}
        </ThemeProvider>
    )
}


Layout.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string.isRequired
};

Layout.defaultProps = {
    title: "Search Land Comps"
}

export default Layout;