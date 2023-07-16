// IMPORTS
import { Center, Image, Stack, Title } from '@mantine/core';

import { At, Key } from 'tabler-icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { authApi } from '../../api/auth';
import {
  Box,
  Button,
  Grid,
  Group,
  LoadingOverlay,
  MantineProvider,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';

import {
  cleanNotifications,
  cleanNotificationsQueue,
  Notifications,
  showNotification,
} from '@mantine/notifications';

import loginImage from '../../assets/loginImg.png';
import { useMediaQuery } from '@mantine/hooks';
// NAVIGATION
const Login = ({ onLogin }) => {
  const matches769 = useMediaQuery('(min-width: 769px)');
  let navigate = useNavigate();
  // HOOKS
  const [visible, setVisible] = useState(false);

  // STYLES CONSTS
  const inputSize = 'md';
  const paddingSize = 5;

  // FORM
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
          ? null
          : 'Invalid email',
      password: (value) => (value !== '' ? null : 'Password is required'),
    },
  });

  // SIGN IN FUNCTION
  const signInFunction = async (values) => {
    cleanNotifications();
    cleanNotificationsQueue();
    setVisible(true);

    try {
      const apiResponse = await authApi.login(values);
      setVisible(false);
      if (apiResponse?.data?.success === true) {
        showNotification({
          title: 'SUCCESS',
          color: 'green',
          message: 'LOGIN SUCCESSFUL',
        });
        await onLogin();
        setTimeout(() => {
          navigate('/stats');
        }, 1000);
      } else if (apiResponse?.data?.success === false) {
        showNotification({
          title: 'CREDENTIALS ERROR',
          color: 'Yellow',
          message: 'Invalid email or password',
        });
      } else {
        showNotification({
          title: 'ERROR',
          color: 'red',
          message: 'SOMETHING WENT WRONG, PLEASE TRY AGAIN',
        });
      }
    } catch (error) {
      setVisible(false);
      if (error.response?.data?.data === 'Invalid Password') {
        showNotification({
          title: 'CREDENTIALS ERROR',
          color: 'yellow',
          message: 'Invalid PASSWORD',
        });
        form.setFieldError('password', 'Invalid password');
      } else if (error.response?.data?.data === 'Email address not found') {
        showNotification({
          title: 'CREDENTIALS ERROR',
          color: 'yellow',
          message: 'Invalid EMAIL',
        });
        form.setFieldError('email', 'Invalid email');
      } else if (error.response?.data?.data === 'inactive') {
        showNotification({
          title: 'User Blocked',
          color: 'red',
          message: 'Sorry but this user is blocked',
        });
        form.setFieldError('email', 'User access blocked, contact admin');
      } else {
        showNotification({
          title: 'ERROR',
          color: 'red',
          message:
            error?.response?.data?.data ||
            error?.response?.data?.message ||
            error?.message ||
            'Something went wrong, please try again',
        });
      }
    }
  };

  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <Notifications />

      <Paper p={0} m={0} style={{ height: '100%', width: '100%' }}>
        <Grid
          align={'center'}
          p={0}
          m={0}
          style={{
            height: '100vh',
            width: '100%',
          }}
        >
          <Grid.Col
            p={0}
            m={0}
            sm={6}
            lg={6}
            style={{
              backgroundColor: '#F7F7F7',
              borderRight: '1px solid #eaeaea',
              height: '100%',
              width: '100%',
            }}
          >
            <Stack
              justify={'center'}
              style={{ height: '100%', width: '100%', marginTop: '5%' }}
            >
              <Title align="center">Welcome to Cars Management System</Title>
              <Text align="center">
                A perfect place to find your dream car!
              </Text>
              <Image
                fit="cover"
                height={'500px'}
                width="100%"
                src={loginImage}
                alt=""
              />
            </Stack>
          </Grid.Col>
          <Grid.Col
            sm={6}
            lg={6}
            style={{
              height: '100%',
              width: '100%',

              position: matches769 ? 'relative' : 'absolute',
              top: matches769 ? '0px' : '35%',
            }}
            p={'xl'}
          >
            <Center style={{ height: '100%', width: '100%' }}>
              <Paper
                withBorder
                mt={'xl'}
                p={'xl'}
                style={{
                  width: '100%',
                  /* From https://css.glass */
                  background: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(5.8px)',
                  WebkitBackdropFilter: 'blur(5.8px)',
                }}
              >
                <Text align="center" size={40}>
                  Sign In
                </Text>

                <form
                  style={{ padding: 0, margin: 0 }}
                  onSubmit={form.onSubmit((values) => signInFunction(values))}
                >
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
                  <TextInput
                    icon={<At />}
                    size={inputSize}
                    py={paddingSize}
                    label="Enter Email Address"
                    placeholder="Enter Email Address"
                    required
                    {...form.getInputProps('email')}
                  />
                  <PasswordInput
                    icon={<Key />}
                    py={paddingSize}
                    size={inputSize}
                    placeholder="Enter Password"
                    label="Password"
                    required
                    {...form.getInputProps('password')}
                  />
                  <Button
                    my="md"
                    size={inputSize}
                    uppercase
                    fullWidth
                    type="submit"
                  >
                    Sign In
                  </Button>
                </form>

                <Group mt={0} p="sm" position="apart">
                  <Box
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <Text component={Link} to="/register" size={18}>
                      SIGN UP
                    </Text>
                  </Box>
                </Group>
              </Paper>
            </Center>
          </Grid.Col>
        </Grid>
      </Paper>
    </MantineProvider>
  );
};
export default Login;
