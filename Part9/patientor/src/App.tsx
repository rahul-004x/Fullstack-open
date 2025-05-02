import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes, useLocation } from "react-router-dom";
import { 
  AppBar,
  Toolbar,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  LocalHospital as LocalHospitalIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AssignmentInd as AssignmentIndIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

import { apiBaseUrl } from "./constants";
import { Patient } from "./types";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientComponent from "./components/SoloPatient/patient";
import Dashboard from "./components/Dashboard";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 240,
          backgroundColor: '#1e1e1e',
          color: 'white',
        },
      },
    },
  },
});

const Navigation = () => {
  // Check localStorage for saved state or default to not collapsed on desktop
  const savedSidebarState = localStorage.getItem('sidebarCollapsed');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    savedSidebarState !== null ? savedSidebarState === 'true' : false
  );
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  // Width values
  const expandedWidth = 240;
  const collapsedWidth = 64;
  const drawerWidth = sidebarCollapsed ? collapsedWidth : expandedWidth;

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
    { text: 'Staff', icon: <AssignmentIndIcon />, path: '/staff' },
  ];

  const drawer = (
    <Box sx={{ color: 'white', overflow: 'hidden' }}>
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          position: 'relative',
          cursor: !isMobile ? 'pointer' : 'default',
          '&:hover': !isMobile ? {
            backgroundColor: 'rgba(255,255,255,0.04)'
          } : {},
          '&::after': !isMobile ? {
            content: '""',
            position: 'absolute',
            right: sidebarCollapsed ? '50%' : 12,
            top: '50%',
            transform: sidebarCollapsed ? 'translate(50%, -50%)' : 'translateY(-50%)',
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.08)',
            opacity: 0,
            transition: 'opacity 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          } : {},
          '&:hover::after': !isMobile ? {
            opacity: 0.8,
            '&::before': {
              content: '""',
              position: 'absolute',
              width: 10,
              height: 10,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundImage: sidebarCollapsed 
                ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'white\'%3E%3Cpath d=\'M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z\'/%3E%3C/svg%3E")' 
                : 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'white\'%3E%3Cpath d=\'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z\'/%3E%3C/svg%3E")',
              opacity: 0.8
            }
          } : {}
        }}
        onClick={!isMobile ? toggleSidebar : undefined}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          position: 'relative'
        }}>
          <LocalHospitalIcon sx={{ mr: sidebarCollapsed ? 0 : 1 }} />
          {!sidebarCollapsed && (
            <Typography variant="h6" noWrap sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              Patientor
              {!isMobile && (
                <Box 
                  component="span" 
                  sx={{ 
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    ml: 0.5,
                    fontSize: '0.7em',
                    color: 'rgba(255,255,255,0.7)',
                    '&::before': {
                      content: '"(Click to collapse)"',
                    },
                    '.MuiBox-root:hover &': {
                      opacity: 0.7
                    }
                  }}
                />
              )}
            </Typography>
          )}
        </Box>
        {!isMobile && (
          <Tooltip 
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"} 
            placement={sidebarCollapsed ? "right" : "right"}
            arrow
          >
            <IconButton 
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
              }} 
              size="small"
              sx={{ 
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: 1,
                width: 30,
                height: 30,
                padding: '4px',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
                '&:focus': {
                  outline: '2px solid rgba(255,255,255,0.3)',
                },
                transition: 'all 0.2s ease',
                transform: sidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'
              }}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronRightIcon fontSize="small" sx={{ 
                transition: 'all 0.2s ease',
              }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      {/* Removed divider since we added border-bottom to header */}
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              px: sidebarCollapsed ? 2 : 3,
              py: 1.5,
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.12)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.08)',
              },
            }}
          >
            <Tooltip title={sidebarCollapsed ? item.text : ''} placement="right" arrow>
              <ListItemIcon 
                sx={{ 
                  color: 'white',
                  minWidth: sidebarCollapsed ? 'auto' : 40, 
                  mr: sidebarCollapsed ? 0 : 2
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            {!sidebarCollapsed && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          width: { sm: `calc(100% - ${isMobile ? 0 : drawerWidth}px)` },
          ml: { sm: `${isMobile ? 0 : drawerWidth}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Patientor'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { width: expandedWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { 
                width: drawerWidth, 
                boxSizing: 'border-box',
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
    </>
  );
};

const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Navigation />
          
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: '100%',
              mt: '64px', // Height of AppBar
              transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard patients={patients} />} />
              <Route path="/patients" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
              <Route path="/patients/:id" element={<PatientComponent />} />
              <Route path="/staff" element={
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5">Staff Management</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    This feature is coming soon...
                  </Typography>
                </Box>
              } />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
