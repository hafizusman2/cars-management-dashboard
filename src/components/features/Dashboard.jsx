import React, { useEffect, useState } from 'react';
import { Grid, LoadingOverlay, Paper, Title } from '@mantine/core';
import { userApi } from '../../api/users';
import { StatsCard } from './StatsCard';

const Dashboard = () => {
  const [stats, setStats] = useState({});

  // LOADING OVERLAY
  const [visible, setVisible] = useState(false);

  const fetchDashboardStats = async () => {
    setVisible(true);
    try {
      const dashboardStats = await userApi.getStats();
      setStats(dashboardStats.data.data);

      setVisible(false);
    } catch (e) {
      setVisible(false);
      console.log('ERROR: ', e);
    }
  };

  const statsData = [
    {
      value: stats?.totalCategories,
      title: 'Total Categories',
      icon: 'user',
    },
    {
      value: stats?.totalUsers,
      title: 'Total Users',
      icon: 'user',
    },
    {
      value: stats?.totalCars,
      title: 'Total Cars',
      icon: 'user',
    },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);
  return (
    <Paper p="md" style={{ position: 'relative' }}>
      <LoadingOverlay
        loaderProps={{
          size: 'xl',
          color: 'pink',
          variant: 'bars',
        }}
        overlayOpacity={0.5}
        overlayColor="#c5c5c5"
        visible={visible}
      />
      <Grid>
        <Grid.Col my="lg">
          <Title align="left">
            <u>Dashboard Statistics</u>
          </Title>
        </Grid.Col>
        <Grid.Col lg={12}>
          <StatsCard data={statsData} cols={3} />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
export default Dashboard;
