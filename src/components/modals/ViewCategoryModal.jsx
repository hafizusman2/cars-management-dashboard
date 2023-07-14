import { Grid, Group, Text } from '@mantine/core';
import React from 'react';
import { User } from 'tabler-icons-react';

const ViewCategoryModal = ({ category }) => {
  return (
    <div>
      <Grid>
        <Grid.Col lg={6}>
          <Group align={'center'} my="sm" noWrap>
            <User size={30} />
            <Text size={20}>{category}</Text>
          </Group>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default ViewCategoryModal;
