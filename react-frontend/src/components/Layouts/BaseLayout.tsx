import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { navItems } from '../../config/menu';
import { Link, Outlet } from 'react-router-dom';
import { useStore } from '../../store/rootStore';
import { observer } from 'mobx-react-lite';
import AppDialo from '../AppDialog/appDialog';
import AppDialog from '../AppDialog/appDialog';
import AppAlert from '../alert/AppAlert';
interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;


 const BaseLayout = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { rootStore: { authStore } } = useStore();
  const { rootStore: { dialogStore} } = useStore();
  const { rootStore: { alertStore} } = useStore();
  const logout = async () =>{
    try {
        const resData = await authStore.logout();
        
    } catch (error) {
        console.log(error)
    }
}
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} className="text-align">
      <Typography variant="h6" sx={{ my: 2 }}>
        G-STOCK
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}  >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem key={"logout"} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={logout} >
              <ListItemText primary={"logout"} />
            </ListItemButton>
          </ListItem>
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
           className="flex-grow hidden sm:block text-left"
          >
            G-STOCK
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item.label} sx={{ color: '#fff' }} component={Link} to={item.url}>
                {item.label}
              </Button>
            ))}
             <Button variant= "contained" key={"logout"} sx={{ color: '#fff' }} onClick={logout} color='success'>
                Deconnecter
              </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" >
         <Toolbar />
         {alertStore.isAlertOpen &&  <AppAlert />}
          <Outlet/>
          {dialogStore.isDialogOpen && <AppDialog  />}
      </Box>
    </Box>
  );
}
export default observer(BaseLayout)