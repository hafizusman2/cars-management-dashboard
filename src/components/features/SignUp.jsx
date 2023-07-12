import {
  Button,
  Grid,
  Group,
  LoadingOverlay,
  Paper,
  TextInput,
  MantineProvider,
  Text,
  Image,
  Title,
  Stack,
} from '@mantine/core';

import { At, User } from 'tabler-icons-react';
import { Box } from '@mantine/core';
import {
  cleanNotifications,
  cleanNotificationsQueue,
  Notifications,
  showNotification,
} from '@mantine/notifications';
import signupImage from '../../assets/signupImage.png';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { userApi } from '../../api/users';

const SignUp = () => {
  const matches769 = useMediaQuery('(min-width: 769px)');
  // HOOKS
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // STYLES CONSTS
  const inputSize = 'md';
  const paddingSize = 5;
  // SIGN UP FUNCTION
  const signUpFunction = async (values) => {
    setLoading(true);
    cleanNotifications();
    cleanNotificationsQueue();
    try {
      await userApi.register(values);
      setLoading(false);

      showNotification({
        color: 'green',
        title: 'SUCCESSFULLY SIGNED UP',
        message:
          'You have successfully signed up, we are redirecting you to the login in page - check your email for credentials',
      });
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (e) {
      setLoading(false);
      showNotification({
        color: 'red',
        title: 'ERROR',
        message:
          e.response.data.data ||
          e.response.data.message ||
          e.message ||
          'Something went wrong, please try again',
      });
      console.log('ERROR', e);
    }
  };

  // FORM
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      city: '',
    },

    validate: {
      email: (value) =>
        value !== ''
          ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
            ? null
            : 'Invalid email address'
          : null,

      name: (value) =>
        value !== ''
          ? /^[A-Za-z ]+$/.test(value)
            ? value.length > 2
              ? null
              : 'Name Should Contain Minimum 3 characters'
            : 'Name Can Contain Only alphabets'
          : null,
      city: (value) =>
        value !== ''
          ? /^[A-Za-z ]+$/.test(value)
            ? value.length > 2
              ? null
              : 'City Should Contain Minimum 3 characters'
            : 'City Can Contain Only alphabets'
          : null,
    },
  });

  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <Notifications />
      <Paper
        p={0}
        m={0}
        style={{ height: '100%', width: '100%', marginBottom: '100px' }}
      >
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
                src={signupImage}
                alt=""
              />
            </Stack>
          </Grid.Col>

          <Grid.Col
            sm={6}
            lg={6}
            style={{
              position: matches769 ? 'relative' : 'absolute',
              width: '100%',
              //   top: matches769 ? '0px' : '250px',
              // set height according to screen
              top: matches769 ? '0px' : '50%',
            }}
            p={'xl'}
          >
            <Paper
              withBorder
              mt={'xl'}
              p={'xl'}
              style={{
                /* From https://css.glass */
                background: 'rgba(255, 255, 255, 0.85)',
                borderRadius: '16px',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5.8px)',
                WebkitBackdropFilter: 'blur(5.8px)',
              }}
            >
              <Text align="center" size={40}>
                Sign Up
              </Text>

              <form
                style={{
                  padding: 0,
                  margin: 0,
                }}
                onSubmit={form.onSubmit((values) => signUpFunction(values))}
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

                <Grid>
                  <Grid.Col span={12}>
                    <TextInput
                      icon={<User />}
                      py={paddingSize}
                      size={inputSize}
                      required
                      placeholder={'Enter Name'}
                      label="Enter Name"
                      {...form.getInputProps('name')}
                    />
                  </Grid.Col>
                </Grid>

                <Grid>
                  <Grid.Col lg={12}>
                    <TextInput
                      icon={<At />}
                      py={paddingSize}
                      size={inputSize}
                      required
                      label="Enter Email"
                      placeholder={'Enter Email'}
                      {...form.getInputProps('email')}
                    />
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={12}>
                    <TextInput
                      size={inputSize}
                      label="City"
                      required
                      placeholder="Enter City"
                      {...form.getInputProps('city')}
                    />
                  </Grid.Col>
                </Grid>
                <Button
                  my="md"
                  size={inputSize}
                  fullWidth
                  type="submit"
                  uppercase
                >
                  Sign Up
                </Button>
              </form>

              <Group mt={0} p="sm">
                <Box
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <Text component={Link} to="/" size={18}>
                    SIGN IN
                  </Text>
                </Box>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
      </Paper>
    </MantineProvider>
  );
};

export default SignUp;
