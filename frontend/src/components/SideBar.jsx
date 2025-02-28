import * as React from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MenuIcon from '@mui/icons-material/Menu';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import { Component,  MapPinned } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };
    const handleLogout = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      navigate("/login");
    };
    const DrawerList = (
      <Box sx={{ width: 250 }} className="flex flex-col h-full  bg-pIsabelline"  role="presentation">
  
        <List className='h-full  ' >
            
           

            
            <ListItem  className="   bg-pSnow"  disablePadding>
              <ListItemButton onClick={() => navigate('/users')}>
                <ListItemIcon>
                <ManageAccountsIcon className='text-primary'/>
                </ListItemIcon>
                <ListItemText className='text-primary' primary={"ادارة المستخدمين"} />
              </ListItemButton>
            </ListItem>
            <Divider />
            
             
            <ListItem  className="   bg-pSnow"  disablePadding>
              <ListItemButton onClick={() => navigate('/departments')}>
                <ListItemIcon>
                <Component className='text-primary'/>
                </ListItemIcon>
                <ListItemText className='text-primary' primary={"ادارة الأقسام"} />
              </ListItemButton>
            </ListItem>
            <Divider />
            
            <ListItem  className="   bg-pSnow"  disablePadding>
              <ListItemButton onClick={() => navigate('/municipalities')}>
                <ListItemIcon>
                <MapPinned className='text-primary'/>
                </ListItemIcon>
                <ListItemText className='text-primary' primary={"البلديات"} />
              </ListItemButton>
            </ListItem>
            <Divider />
        </List>
        <ListItem  className=" bottom-0  bg-white" disablePadding>
              <ListItemButton  onClick={handleLogout}>
                <ListItemIcon>
                <LogoutIcon className='text-primary'/>
                </ListItemIcon>
                <ListItemText className='text-primary' primary={" خروج"} />
              </ListItemButton>
            </ListItem>
      </Box>
    );

   
  return (
    <main className='h-min w-min'>
    <Button onClick={toggleDrawer(true)}>
        <MenuIcon className=' text-primary ' />
    </Button>
    <Drawer anchor='right'  open={open} onClose={toggleDrawer(false)}>
      {DrawerList}
    </Drawer>
    </main>
  )
}
