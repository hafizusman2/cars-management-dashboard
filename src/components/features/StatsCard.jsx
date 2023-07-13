import { Paper, SimpleGrid, Stack, Text } from '@mantine/core';

export const StatsCard = ({ data, cols }) => {
  return (
    <SimpleGrid
      cols={cols}
      breakpoints={[
        { maxWidth: 'xl', cols: 1 },
        { maxWidth: 'lg', cols: 1 },
        { maxWidth: 'md', cols: 1 },
        { maxWidth: 'sm', cols: 1 },
      ]}
    >
      {data.map((stat, index) => {
        return (
          <Paper
            p="md"
            withBorder
            radius="md"
            key={index}
            style={{
              backgroundColor: '#DC143C',
            }}
          >
            <Stack align="center">
              <Text size={18} color="white">
                {stat.title}
              </Text>

              <Text
                px="xs"
                weight="bold"
                size={30}
                align="center"
                color="white"
              >
                {stat.value}
              </Text>
            </Stack>
          </Paper>
        );
      })}
    </SimpleGrid>
  );
};
