import { Carousel } from '@mantine/carousel';
import { Divider, Grid, Group, Image, Stack, Text, Title } from '@mantine/core';
import React from 'react';
import { CalendarEvent, GasStation } from 'tabler-icons-react';

const ViewCarModal = ({ carDetails }) => {
  let iconSize = 30;
  const images = carDetails?.assets.length > 0 ? carDetails?.assets : [''];
  let processedImages = images?.map((image) => image?.asset);

  return (
    <div>
      <Group position="apart">
        <Title order={3}>
          ${carDetails?.price.toLocaleString()} - {carDetails?.title}{' '}
        </Title>
      </Group>
      <Group position="apart"></Group>
      <Grid>
        <Grid.Col>
          {carDetails.assets?.length > 0 && (
            <Carousel withIndicators>
              {processedImages?.map((image, index) => (
                <Carousel.Slide key={index}>
                  <Image
                    key={index}
                    fit="cover"
                    src={image}
                    height="500px"
                    width="100%"
                  />
                </Carousel.Slide>
              ))}
            </Carousel>
          )}
        </Grid.Col>
      </Grid>

      <Grid mt={'md'} p={'sm'} style={{}}>
        <Grid.Col
          xs={6}
          sm={6}
          md={6}
          lg={3}
          xl={3}
          style={{ border: '1px solid #E6E6E6' }}
        >
          <Stack justify={'center'} align={'center'}>
            <CalendarEvent size={iconSize} />
            {carDetails?.year}
          </Stack>
        </Grid.Col>

        <Grid.Col
          xs={6}
          sm={6}
          md={6}
          lg={3}
          xl={3}
          style={{ border: '1px solid #E6E6E6' }}
        >
          <Stack justify={'center'} align={'center'}>
            <GasStation size={iconSize} />
            {carDetails?.regNo}
          </Stack>
        </Grid.Col>

        <Grid my={'md'}>
          <Grid.Col span={6} style={{ borderRight: '1px solid #E6E6E6' }}>
            <Grid>
              <Grid.Col>
                <Divider mb={'sm'} />
                <Group position="apart">
                  <Text>Manufacturer</Text>
                  <Text>{carDetails.manufacturer}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col>
                <Divider mb={'sm'} />
                <Group position="apart">
                  <Text>Make</Text>
                  <Text>{carDetails.make}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col>
                <Divider mb={'sm'} />
                <Group position="apart">
                  <Text>Model</Text>
                  <Text>{carDetails.model}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col>
                <Divider mb={'sm'} />
                <Group position="apart">
                  <Text>Color</Text>
                  <Text>{carDetails.color}</Text>
                </Group>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={6}>
            <Grid>
              <Grid.Col>
                <Divider mb={'sm'} />
                <Group position="apart">
                  <Text>Category</Text>
                  <Text>{carDetails.category}</Text>
                </Group>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewCarModal;
