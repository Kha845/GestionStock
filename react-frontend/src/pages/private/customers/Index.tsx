import { Box, Container, Toolbar } from "@mui/material"
import { observer } from "mobx-react-lite"
import { Outlet } from "react-router-dom"

const Customers = () =>{
    return (
            <Container maxWidth="lg">
                <Box component="main">
                <Toolbar />
                    <Outlet/>
                </Box>
            </Container>

    )
}

export default observer(Customers) 