import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Collapse,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  Category,
  People,
  Business,
  ShoppingCart,
  LocalShipping,
  TrendingUp,
  Person,
  ExpandLess,
  ExpandMore,
  Settings,
  BarChart,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { getPrincipalRole, hasAccess } from '../../utils/roleUtils';

interface SidebarProps {
  onItemClick?: () => void;
}

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path?: string;
  children?: MenuItem[];
  roles?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const { user } = useAppSelector((state) => state.auth);

  // Fonction pour vérifier si l'utilisateur a accès à un élément de menu
  const checkAccess = (requiredRoles?: string[]): boolean => {
    return hasAccess(user, requiredRoles);
  };

  const menuItems: MenuItem[] = [
    {
      text: 'Tableau de bord',
      icon: <Dashboard />,
      roles: ['ADMIN', 'MANAGER', 'USER'],
      children: [
        { text: 'Vue d\'ensemble', icon: <Dashboard />, path: '/', roles: ['ADMIN', 'MANAGER', 'USER'] },
        { text: 'Statistiques', icon: <BarChart />, path: '/statistiques', roles: ['ADMIN', 'MANAGER', 'USER'] },
      ],
    },
    {
      text: 'Articles',
      icon: <Inventory />,
      roles: ['ADMIN', 'MANAGER', 'USER'],
      children: [
        { text: 'Articles', icon: <Inventory />, path: '/articles', roles: ['ADMIN', 'MANAGER', 'USER'] },
        { text: 'Mouvements du stock', icon: <TrendingUp />, path: '/mvtstk', roles: ['ADMIN', 'MANAGER'] },
      ],
    },
    {
      text: 'Clients',
      icon: <People />,
      roles: ['ADMIN', 'MANAGER'],
      children: [
        { text: 'Clients', icon: <People />, path: '/clients', roles: ['ADMIN', 'MANAGER'] },
        { text: 'Commandes clients', icon: <ShoppingCart />, path: '/commandesclient', roles: ['ADMIN', 'MANAGER'] },
      ],
    },
    {
      text: 'Fournisseurs',
      icon: <Business />,
      roles: ['ADMIN', 'MANAGER'],
      children: [
        { text: 'Fournisseurs', icon: <Business />, path: '/fournisseurs', roles: ['ADMIN', 'MANAGER'] },
        { text: 'Commandes fournisseurs', icon: <LocalShipping />, path: '/commandesfournisseur', roles: ['ADMIN', 'MANAGER'] },
      ],
    },
    {
      text: 'Paramétrages',
      icon: <Settings />,
      roles: ['ADMIN'],
      children: [
        { text: 'Catégories', icon: <Category />, path: '/categories', roles: ['ADMIN', 'MANAGER'] },
        { text: 'Utilisateurs', icon: <Person />, path: '/utilisateurs', roles: ['ADMIN'] },
      ],
    },
  ];

  const handleItemClick = (path?: string) => {
    if (path) {
      navigate(path);
      onItemClick?.();
    }
  };

  const handleMenuToggle = (menuText: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuText]: !prev[menuText]
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (children: MenuItem[]) => {
    return children.some(child => child.path && isActive(child.path));
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    // Vérifier les permissions d'accès
    if (!checkAccess(item.roles)) {
      return null;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.text];
    const active = item.path ? isActive(item.path) : (hasChildren && isParentActive(item.children!));

    return (
      <React.Fragment key={item.text}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleMenuToggle(item.text);
              } else {
                handleItemClick(item.path);
              }
            }}
            selected={active}
            sx={{
              pl: 2 + level * 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontSize: level > 0 ? '0.875rem' : '1rem',
              }}
            />
            {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Titre */}
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Stock Manager
        </Typography>
      </Toolbar>
      
      <Divider />

      {/* Menu de navigation */}
      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
