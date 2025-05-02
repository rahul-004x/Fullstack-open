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
  ChevronRight as ChevronRightIcon,
  Add as AddIcon
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
          backgroundColor: '#1a2035',
          color: 'white',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          margin: '4px 8px',
          borderRadius: '8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.12) !important',
          },
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
          p: 2.5, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
          cursor: !isMobile ? 'pointer' : 'default',
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          '&:hover': !isMobile ? {
            backgroundColor: 'rgba(255,255,255,0.06)'
          } : {},
        }}
        onClick={!isMobile ? toggleSidebar : undefined}
      >          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            position: 'relative'
          }}>
            <LocalHospitalIcon 
              sx={{ 
                mr: sidebarCollapsed ? 0 : 1.5,
                fontSize: '1.75rem',
                color: 'primary.main',
                transition: 'all 0.2s ease'
              }} 
            />
            {!sidebarCollapsed && (
              <Typography 
                variant="h6" 
                noWrap 
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  background: 'linear-gradient(45deg, #fff, rgba(255,255,255,0.8))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Patientor
              </Typography>
            )}
        </Box>
        {!isMobile && !sidebarCollapsed && (
          <Tooltip 
            title="Collapse sidebar"
            placement="right"
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
                backgroundColor: 'rgba(255,255,255,0.04)',
                borderRadius: 1.5,
                width: 28,
                height: 28,
                padding: '6px',
                border: '1px solid',
                borderColor: 'rgba(255,255,255,0.08)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'rgba(255,255,255,0.15)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
                transition: 'all 0.2s ease'
              }}
              aria-label="Collapse sidebar"
            >
              <ChevronRightIcon fontSize="small" sx={{ 
                transition: 'all 0.2s ease',
                transform: 'rotate(180deg)'
              }} />
            </IconButton>
          </Tooltip>
        )}
        {!isMobile && sidebarCollapsed && (
          <Tooltip 
            title="Expand sidebar"
            placement="right"
            arrow
          >
            <IconButton 
              onClick={toggleSidebar}
              size="small"
              sx={{ 
                position: 'absolute',
                right: -14,
                top: 12,
                color: '#1a2035',
                backgroundColor: 'white',
                borderRadius: '50%',
                width: 28,
                height: 28,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
                transition: 'all 0.2s ease',
                zIndex: 1
              }}
              aria-label="Expand sidebar"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      {/* Menu items */}
      <List sx={{ mt: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              px: sidebarCollapsed ? 2 : 2.5,
              py: 1.5,
              mb: 0.5,
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.12)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 3,
                  height: '60%',
                  backgroundColor: 'primary.main',
                  borderRadius: '0 4px 4px 0',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.06)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Tooltip title={sidebarCollapsed ? item.text : ''} placement="right" arrow>
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === item.path ? 'primary.main' : 'rgba(255,255,255,0.7)',
                  minWidth: sidebarCollapsed ? 'auto' : 40, 
                  mr: sidebarCollapsed ? 0 : 2,
                  transition: 'color 0.2s ease',
                  '& svg': {
                    fontSize: '1.3rem',
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            {!sidebarCollapsed && (
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiListItemText-primary': {
                    fontSize: '0.9rem',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color: location.pathname === item.path ? 'white' : 'rgba(255,255,255,0.7)',
                    transition: 'all 0.2s ease',
                  }
                }}
              />
            )}
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
              sx={{ 
                mr: 2,
                backgroundColor: 'rgba(33, 150, 243, 0.08)',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'rgba(33, 150, 243, 0.15)',
                }
              }}
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
