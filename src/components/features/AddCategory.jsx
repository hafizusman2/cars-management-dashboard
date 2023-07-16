import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Grid,
  Paper,
  Title,
  Button,
  TextInput,
  LoadingOverlay,
  Center,
} from '@mantine/core';

import { categoriesApi } from '../../api/categories';
import { ArrowRight } from 'tabler-icons-react';

import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';

const AddCategory = ({ setCurrentLocation }) => {
  const params = useParams();
  // HOOKS

  const [loading, setLoading] = useState(false);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: '',
    },

    validate: {
      name: (value) =>
        value?.trim().length > 1 && /^[a-zA-Z\s]*$/.test(value?.trim())
          ? null
          : 'Alphabetic Name with 2 or more characters',
    },
  });

  const getCategory = async () => {
    try {
      const res = await categoriesApi.getCategoryById(params.id);
      form.setFieldValue('name', res.data.data.name);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (params?.id) {
      setCurrentLocation('Update Category');
      getCategory();
    } else {
      setCurrentLocation('Add Category');
    }
  }, []);

  let navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (params?.id) {
        await categoriesApi.updateCategoryById({
          id: params.id,
          name: values.name,
        });
      } else {
        await categoriesApi.add({
          name: values.name,
        });
      }
      setLoading(false);

      showNotification({
        color: 'green',
        title: 'Success',
        message: params?.id
          ? 'Category Updated Successfully'
          : 'Category Added Successfully',
      });
      setTimeout(() => {
        navigate('/stats/categories');
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

  return (
    <Paper
      style={{
        width: '100%',
        height: '100%',
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

          <Title order={1} align="center">
            {params?.id ? "Update Car's Category" : "Enter Car's Category"}
          </Title>
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Grid justify="space-around">
              <Grid.Col lg={12}>
                <TextInput
                  size="md"
                  required
                  label="Name"
                  placeholder="Enter category"
                  {...form.getInputProps('name')}
                />
              </Grid.Col>
            </Grid>

            <Grid justify="flex-end">
              <Grid.Col sm={6} xs={6} lg={3}>
                <Button
                  type="submit"
                  size="md"
                  fullWidth
                  variant="filled"
                  color="dark"
                  disabled={loading}
                  onClick={() => {
                    const data = form.validate();
                    if (data.hasErrors === false) {
                      handleSubmit(form.values);
                    }
                  }}
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

export default AddCategory;
