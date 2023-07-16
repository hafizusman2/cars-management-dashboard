import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Grid,
  Paper,
  Title,
  Button,
  TextInput,
  Select,
  LoadingOverlay,
  Center,
  NumberInput,
} from '@mantine/core';
import { Modal } from '@mantine/core';
import { ArrowRight, Trash, TrashOff, X } from 'tabler-icons-react';

import { useForm } from '@mantine/form';
import UploadImage from './UploadImage';
import { carsApi } from '../../api/cars';
import { categoriesApi } from '../../api/categories';
import { showNotification } from '@mantine/notifications';

const AddCar = ({ setCurrentLocation }) => {
  const params = useParams();

  const [errorMessages, setErrorMessages] = useState({});

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [disabled1, setDisabled1] = useState(false);
  const [disabled2, setDisabled2] = useState(true);
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState('');
  const [hidden, setHidden] = useState(true);
  const [categories, setCategories] = useState([]);
  const [indexOfCoverImageURL, setIndexOfCoverImageURL] = useState();
  const [images, setImages] = useState([]);
  const [percentages, setPercentages] = useState([]);
  const [urls, setUrls] = useState([]);
  const [imageURLS, setImageURLS] = useState([]);

  let navigate = useNavigate();

  const renderErrorMessage = (name) => {
    if (errorMessages[name]) {
      return errorMessages[name];
    }
  };
  const getCar = async () => {
    try {
      setLoading(true);
      const res = await carsApi.getCarById(params.id);
      if (res.data.success) {
        let response = res.data?.data;
        form.setFieldValue('title', response?.title);
        form.setFieldValue('regNo', response?.regNo);
        form.setFieldValue('category', response?.category);
        form.setFieldValue('make', response?.make);
        form.setFieldValue('model', response?.model);
        form.setFieldValue('year', parseInt(response?.year));
        form.setFieldValue('manufacturer', response?.manufacturer);
        form.setFieldValue('color', response?.color);
        form.setFieldValue('price', response?.price);
        let images = response?.assets?.map((item) => item?.asset);
        setImages(images);
      } else {
        alert('Error fetching car data');
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const getCategories = async () => {
    setLoading(true);
    try {
      const res = await categoriesApi.getAll();
      const categoriesData = res.data.data.map((cat) => {
        cat.label = cat.name;
        cat.value = cat._id;
        delete cat.name;
        delete cat._id;
        return cat;
      });
      setCategories(categoriesData);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  useEffect(() => {
    getCategories();
    if (params?.id) {
      setCurrentLocation('Update Car');
      getCar();
    } else {
      setCurrentLocation('Add Car');
    }
  }, []);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      title: '',
      regNo: '',
      make: '',
      model: '',
      year: '',
      manufacturer: '',
      color: '',
      price: '',
      category: '',
    },

    validate: {
      title: (value) => {
        if (value === '') {
          return 'Title is Required';
        }
      },
      category: (value) => {
        if (value === '') {
          return 'Category is Required';
        }
      },

      regNo: (value) => {
        if (value === '') {
          return 'regNo is Required';
        }
      },

      make: (value) => {
        if (value === '') {
          return 'Make is Required';
        }
      },
      model: (value) => {
        if (value === '') {
          return 'Model is Required';
        }
      },
      year: (value) => {
        if (value === '') {
          return 'Year is Required';
        } //regex for numbers only
        else if (!/^[0-9]+$/.test(value)) {
          return 'Year must be a number';
        } else if (value?.toString()?.length !== 4) {
          return 'Year of 4 characters is Required';
        } else if (value < 1900 || value > new Date().getFullYear()) {
          return `Year must be between 1900 and ${new Date().getFullYear()}`;
        }
      },

      manufacturer: (value) => {
        if (value === '') {
          return 'Manufacturer is Required';
        }
      },

      color: (value) => {
        if (value === '') {
          return 'Color is Required';
        }
      },
      price: (value) => {
        if (value === '') {
          return 'Price is Required';
        } //regex for numbers only
        else if (!/^[0-9]+$/.test(value)) {
          return 'Price must be a number';
        }
      },
    },
  });

  const handleSubmit = async (event) => {
    setLoading(true);
    let form_data = new FormData();
    form_data.append('title', event?.title);
    form_data.append('regNo', event?.regNo);
    form_data.append('make', event?.make);
    form_data.append('model', event?.model);
    form_data.append('year', event?.year);
    form_data.append('category', event?.category);
    form_data.append('manufacturer', event?.manufacturer);
    form_data.append('price', event?.price);
    form_data.append('color', event?.color);

    for (let image of images) {
      form_data.append('assets', image);
    }
    let response;
    try {
      if (params?.id) {
        response = await carsApi.updateCarById(params.id, form_data);
      } else {
        response = await carsApi.add(form_data);
      }
      setLoading(false);
      if (response.data.success) {
        showNotification({
          title: 'Success',
          message: params?.id
            ? 'Car Updated Successfully'
            : 'Car Added Successfully',
          color: 'green',
        });
        setTimeout(() => {
          navigate('/stats/cars');
        }, 1500);
      } else {
        showNotification({
          title: 'Error',
          message: 'Car Not Added',
          color: 'red',
        });
      }
    } catch (error) {
      setLoading(false);
      showNotification({
        title: 'Error',
        message:
          error?.response?.data?.data ||
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong, please try again',
        color: 'red',
      });
    }
  };

  return (
    <Paper
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <Center>
        <Paper
          style={{
            width: '80%',
            height: '100%',
          }}
        >
          <LoadingOverlay
            visible={loading}
            loaderProps={{ size: 'xl', color: 'pink', variant: 'bars' }}
            overlayOpacity={0.5}
            overlayColor="#c5c5c5"
            zIndex={1}
          />
          <Modal
            styles={{
              close: {
                color: 'black',
                backgroundColor: '#EAEAEA',
                borderRadius: '50%',
                '&:hover': {
                  transition: '50ms',
                  color: 'white',
                  backgroundColor: 'red',
                },
              },
            }}
            opened={opened}
            transition="rotate-left"
            transitionDuration={600}
            size={600}
            transitionTimingFunction="ease"
            onClose={() => setOpened(false)}
          >
            <Title align="center" order={3}>
              Are You Sure Yo Want To Cancel?
            </Title>
            <Grid align="center" justify="space-around" p="md">
              <Grid.Col align="center" xs={3} sm={3} md={4} lg={4}>
                <Button
                  align="center"
                  color="light"
                  leftIcon={<TrashOff size={14} />}
                  onClick={() => setOpened(false)}
                >
                  No, Don't Cancel
                </Button>
              </Grid.Col>
              <Grid.Col align="center" xs={5} sm={4} md={4} lg={4}>
                <Button
                  align="center"
                  color="red"
                  leftIcon={<Trash size={14} />}
                  onClick={() => navigate(`/stats/cars`)}
                >
                  Yes, Cancel
                </Button>
              </Grid.Col>
            </Grid>
          </Modal>
          <Title order={1} p="md" align="center">
            {params?.id ? 'Update Car Details' : 'Enter Car Details'}
          </Title>
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Grid justify="space-around">
              <Grid.Col md={12} lg={12}>
                <TextInput
                  maxLength={50}
                  error={renderErrorMessage('Title')}
                  size="md"
                  required
                  label="Car Title"
                  placeholder="Enter Car's Title"
                  {...form.getInputProps('title')}
                />
              </Grid.Col>
              <Grid.Col md={12}>
                <Select
                  label="Categories"
                  searchable
                  required
                  size="md"
                  placeholder="Select Category"
                  data={categories}
                  {...form.getInputProps('category')}
                />
              </Grid.Col>

              <Grid.Col md={12} lg={6}>
                <NumberInput
                  error={renderErrorMessage('Price')}
                  size="md"
                  required
                  label="Car Price"
                  placeholder="Enter Car's Price"
                  {...form.getInputProps('price')}
                />
              </Grid.Col>
              <Grid.Col md={12} lg={6}>
                <TextInput
                  error={renderErrorMessage('RegNo')}
                  size="md"
                  required
                  label="Reg No."
                  placeholder="Enter Car's Reg No"
                  {...form.getInputProps('regNo')}
                />
              </Grid.Col>

              <Grid.Col md={12} lg={6}>
                <TextInput
                  error={renderErrorMessage('Make')}
                  size="md"
                  required
                  label="Make"
                  placeholder="Enter Car's Make"
                  {...form.getInputProps('make')}
                />
              </Grid.Col>
              <Grid.Col md={12} lg={6}>
                <TextInput
                  error={renderErrorMessage('Model')}
                  size="md"
                  required
                  label="Model"
                  placeholder="Enter Car's Model"
                  {...form.getInputProps('model')}
                />
              </Grid.Col>
              <Grid.Col md={12} lg={6}>
                <TextInput
                  error={renderErrorMessage('Year')}
                  size="md"
                  required
                  label="Year"
                  placeholder="Enter Car's Year"
                  {...form.getInputProps('year')}
                />
              </Grid.Col>
              <Grid.Col md={12} lg={6}>
                <TextInput
                  size="md"
                  required
                  label="Manufacturer"
                  placeholder="Enter Car's Manufacturer"
                  {...form.getInputProps('manufacturer')}
                />
              </Grid.Col>
              <Grid.Col md={12} lg={6}>
                <TextInput
                  error={renderErrorMessage('Color')}
                  size="md"
                  required
                  label="Color"
                  placeholder="Enter Car's Color"
                  {...form.getInputProps('color')}
                />
              </Grid.Col>
            </Grid>
            <UploadImage
              error={error}
              setError={setError}
              disabled={disabled}
              setDisabled={setDisabled}
              disabled1={disabled1}
              setDisabled1={setDisabled1}
              disabled2={disabled2}
              setDisabled2={setDisabled2}
              images={images}
              setImages={setImages}
              percentages={percentages}
              setPercentages={setPercentages}
              urls={urls}
              setUrls={setUrls}
              imageURLS={imageURLS}
              setImageURLS={setImageURLS}
              indexOfCoverImageURL={indexOfCoverImageURL}
              setIndexOfCoverImageURL={setIndexOfCoverImageURL}
              hidden={hidden}
              setHidden={setHidden}
              folder="Cars"
              addImages="Describe Your Car With Images"
            />

            <Grid justify="flex-end">
              <Grid.Col sm={6} xs={6} md={6} lg={3}>
                <Button
                  size="md"
                  fullWidth
                  variant="filled"
                  color="red"
                  disabled={loading}
                  rightIcon={<X />}
                  onClick={() => setOpened(true)}
                >
                  CANCEL
                </Button>
              </Grid.Col>
              <Grid.Col sm={6} xs={6} md={6} lg={3}>
                <Button
                  type="submit"
                  size="md"
                  fullWidth
                  variant="filled"
                  color="dark"
                  disabled={disabled}
                  loading={loading}
                  rightIcon={<ArrowRight />}
                >
                  {params?.id ? 'UPDATE' : 'ADD'}
                </Button>
              </Grid.Col>
            </Grid>
          </form>
        </Paper>
      </Center>
    </Paper>
  );
};

export default AddCar;
