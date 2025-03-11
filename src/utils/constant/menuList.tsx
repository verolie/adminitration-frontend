// config/menuItems.ts
import HomeIcon from '@mui/icons-material/Home';
import DomainIcon from '@mui/icons-material/Domain';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import BuildIcon from '@mui/icons-material/Build';
import Image from 'next/image';
import React from 'react';
import styles from './style/menuBar.module.css';

interface MenuList {
  no: number;
  label: string;
  path: string;
  icon: React.ReactNode;
  submenu?: SubItemList[] | null;
  roles?: string[];
}

interface SubItemList {
  label: string;
  path: string;
  roles: string[];
}
export const menuList: MenuList[] = [
  {
    no: 1,
    label: 'Home',
    path: '/',
    icon: <HomeIcon className={styles.icon} />,
    submenu: null,
    roles: ['Dashboard'],
  },
  {
    no: 2,
    label: 'Company',
    path: '/company',
    icon: <DomainIcon className={styles.icon} />,
    submenu: null,
    roles: ['Company'],
  },
  {
    no: 3,
    label: 'Division',
    path: '/division',
    icon: <PeopleAlt className={styles.icon} />,
    submenu: null,
    roles: ['Division'],
  },
  {
    no: 4,
    label: 'Unit',
    path: '/unit',
    icon: (
      <Image
        src="/images/icon/unit.svg"
        className={styles.iconImage}
        width={22}
        height={22}
        alt="Unit Icon"
      />
    ),
    submenu: null,
    roles: ['Unit'],
  },
  {
    no: 5,
    label: 'Device',
    path: '/device',
    icon: <BuildIcon className={styles.iconDevice} />,
    submenu: null,
    roles: ['Device'],
  },
  {
    no: 6,
    label: 'Sub-Division', // Changed label to avoid duplication
    path: '',
    icon: (
      <Image
        src="/images/icon/sub-unit.svg"
        width={22}
        height={22}
        alt="Unit Icon"
        className={styles.iconImage}
      />
    ),
    submenu: [
      {
        label: 'Sub-Unit Terakhir',
        path: '/sub-unit',
        roles: ['Sub Unit Terakhir'],
      },
      {
        label: 'Calculation Configuration',
        path: '/calculation-configuration',
        roles: ['Calculation Configuration'],
      },
      {
        label: 'Fuel Type',
        path: '/fuel-type',
        roles: ['Fuel Type'],
      },
      {
        label: 'Industry Sector',
        path: '/industry-sector',
        roles: ['Industry Sector'],
      },
    ],
    roles: ['Sub-Division'],
  },
  {
    no: 7,
    label: 'User Admin', // Changed label to avoid duplication
    path: '',
    icon: (
      <Image
        src="/images/icon/user-admin.svg"
        width={22}
        height={22}
        alt="User Admin"
        className={styles.iconImage}
      />
    ),
    submenu: [
      {
        label: 'User Management',
        path: '/user-management',
        roles: ['User Management'],
      },
      {
        label: 'User Role Management',
        path: '/user-management-role',
        roles: ['User Role Management'],
      },
    ],
    roles: ['User Admin'],
  },
];
