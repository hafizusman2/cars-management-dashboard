import React from 'react';
import * as RiIcons from 'react-icons/ri';
import { Users, Plus, Eye, UserPlus, Layout2, Car } from 'tabler-icons-react';

export const SideBarData = [
  {
    title: '1 - Dashboard',
    path: '/stats',
    icon: <Layout2 size={21} />,
  },
  {
    title: '2 - Categories',
    path: '#',
    icon: <Users size={21} />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: '2.1 - Add Category',
        path: '/stats/add-category',
        icon: <UserPlus size={20} />,
        cName: 'sub-nav',
      },
      {
        title: '2.2 - View All Categories',
        path: '/stats/categories',
        icon: <Users size={20} />,
        cName: 'sub-nav',
      },
    ],
  },
  {
    title: '3 - Cars',
    path: '#',
    icon: <Car size={21} />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: '3.1 - Add Car',
        path: '/stats/add-car',
        icon: <Plus />,
        cName: 'sub-nav',
      },
      {
        title: '3.2 - View All Cars',
        path: '/stats/cars',
        icon: <Eye />,
        cName: 'sub-nav',
      },
    ],
  },
];
