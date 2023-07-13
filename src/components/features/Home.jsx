import React, { useState, memo, useEffect } from 'react';
import { ArrowLeft, Logout } from 'tabler-icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import SideBar from '../common/sidebar/Sidebar';
import { useNavigate, Outlet } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  MantineProvider,
  Title,
  Divider,
  Group,
  ScrollArea,
  Menu,
  ActionIcon,
  LoadingOverlay,
  Avatar,
} from '@mantine/core';
import { userApi } from '../../api/users';
import { removeToken } from '../../utils/authUtils';

// HOME COMPONENT
const Home = ({ currentLocation, onLogout }) => {
  const [navbarOpen, setNavbarOpen] = useState('true');
  const [loading, setLoading] = useState(false);
  // SELECTOR
  const [loggedInUser, setLoggedInUser] = useState({});
  const fetchData = async () => {
    setLoading(true);
    try {
      const userData = await userApi.getMe();
      setLoggedInUser(userData.data.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('ERROR: ', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  let navigate = useNavigate();
  const matches = useMediaQuery('(min-width: 1000px)');
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(true);

  return (
    <MantineProvider
      theme={{
        fontFamily: 'Poppins, sans-serif',
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Notifications position="top-right" limit={1} />
      <ModalsProvider>
        <AppShell
          styles={{
            root: {
              width: '100%',
              height: '100%',
            },
          }}
          navbarOffsetBreakpoint="md"
          fixed
          navbar={
            <Navbar
              style={{
                backgroundColor: '#DC143C',
              }}
              hiddenBreakpoint="md"
              hidden={opened}
              width={{
                xs: navbarOpen === 'true' ? 350 : 0,
                sm: navbarOpen === 'true' ? 350 : 0,
                md: navbarOpen === 'true' ? 350 : 0,
                lg: navbarOpen === 'true' ? 350 : 0,
              }}
            >
              <LoadingOverlay
                loaderProps={{
                  size: 'xl',
                  color: 'pink',
                  variant: 'bars',
                }}
                overlayOpacity={0.5}
                overlayColor="#c5c5c5"
                visible={loading}
              />
              <ScrollArea type="never" offsetScrollbars>
                <SideBar
                  currentLocation={currentLocation}
                  setOpened={setOpened}
                />
              </ScrollArea>
            </Navbar>
          }
          header={
            <Header height={70}>
              {matches ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Group>
                    <div
                      style={{
                        backgroundColor: '#DC143C',

                        width: navbarOpen === 'true' ? 349 : 0,
                        height: '70px',
                      }}
                    >
                      <Group position="apart" py="sm" px="md">
                        <Title
                          hidden={navbarOpen === 'true' ? false : true}
                          size={50}
                          style={{
                            color: 'white',
                          }}
                        >
                          CMS
                        </Title>
                        <ActionIcon
                          hidden={navbarOpen === 'true' ? false : true}
                          variant="transparent"
                          color={'white'}
                          onClick={() => {
                            if (navbarOpen === 'true') {
                              setNavbarOpen('false');
                            } else {
                              setNavbarOpen('true');
                            }
                          }}
                        >
                          {navbarOpen === 'true' && <ArrowLeft color="white" />}
                        </ActionIcon>
                      </Group>
                      <Divider color="gray" />
                    </div>
                    <ActionIcon
                      variant="transparent"
                      onClick={() => {
                        if (navbarOpen === 'true') {
                          setNavbarOpen('false');
                        } else {
                          setNavbarOpen('true');
                        }
                      }}
                    >
                      {navbarOpen !== 'true' && (
                        <Burger color={theme.colors.gray[6]} />
                      )}
                    </ActionIcon>
                  </Group>
                  <Group>
                    <Text weight="bold" size={23}>
                      Cars Management System
                    </Text>
                    <Text color="#00619E" size={23}>
                      {currentLocation}
                    </Text>
                  </Group>
                  {/* </div> */}
                  <div className="items">
                    <div className="item" style={{ cursor: 'pointer' }}>
                      <Group position="center">
                        <Menu
                          withArrow
                          width={350}
                          position="bottom"
                          transition="pop"
                        >
                          <Menu.Target>
                            <ActionIcon>
                              <Avatar
                                radius="xl"
                                src={loggedInUser?.profileImage?.image}
                              />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item>
                              <Group>
                                <Avatar
                                  radius="xl"
                                  size={'lg'}
                                  src={loggedInUser?.profileImage?.image}
                                />
                                <div>
                                  <Text weight={500}>{loggedInUser?.name}</Text>
                                  <Text size="xs" color="dimmed">
                                    {loggedInUser?.email}
                                  </Text>
                                </div>
                              </Group>
                            </Menu.Item>

                            <Menu.Label>Danger zone</Menu.Label>
                            <Menu.Item
                              icon={<Logout />}
                              onClick={() => {
                                removeToken();
                                onLogout();
                                navigate('/');
                              }}
                            >
                              Logout
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <MediaQuery largerThan="md" styles={{ display: 'none' }}>
                    <Burger
                      opened={!opened}
                      onClick={() => setOpened((o) => !o)}
                      size="md"
                      px="md"
                      color={theme.colors.gray[6]}
                    />
                  </MediaQuery>
                  <div>
                    <Title>CMS</Title>
                  </div>

                  <div className="items">
                    <div className="item" style={{ cursor: 'pointer' }}>
                      <Group position="center">
                        <Menu
                          withArrow
                          width={350}
                          position="bottom"
                          transition="pop"
                        >
                          <Menu.Target>
                            <ActionIcon>
                              <Avatar
                                radius="xl"
                                src={loggedInUser?.profileImage?.image}
                              />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item>
                              <Group>
                                <Avatar
                                  radius="xl"
                                  size={'lg'}
                                  src={loggedInUser?.profileImage?.image}
                                />
                                <div>
                                  <Text weight={500}>{loggedInUser?.name}</Text>
                                  <Text size="xs" color="dimmed">
                                    {loggedInUser?.email}
                                  </Text>
                                </div>
                              </Group>
                            </Menu.Item>

                            <Menu.Divider />

                            <Menu.Label>Danger zone</Menu.Label>
                            <Menu.Item
                              icon={<Logout />}
                              onClick={() => {
                                removeToken();
                                onLogout();
                                navigate('/');
                              }}
                            >
                              Logout
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </div>
                  </div>
                </div>
              )}
            </Header>
          }
        >
          <Outlet />
        </AppShell>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default memo(Home);
