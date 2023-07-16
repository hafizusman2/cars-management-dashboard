import * as React from 'react';
import {
  ActionIcon,
  LoadingOverlay,
  SimpleGrid,
  TextInput,
} from '@mantine/core';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useMediaQuery } from '@mantine/hooks';

import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';

import Paper from '@mui/material/Paper';

import { Text } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  Filter,
  UserSearch,
  Plus,
  Trash,
  TrashOff,
  Edit,
} from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import { carsApi } from '../../api/cars';

import { visuallyHidden } from '@mui/utils';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Menu } from '@mantine/core';

import { useState } from 'react';
import { Modal, Button, Title, Grid } from '@mantine/core';

import { createStyles } from '@mantine/core';
import { useEffect } from 'react';
import ViewCarModal from './ViewCarModal';

const theme = createTheme({
  typography: {
    body2: {
      // Define the desired styles for body2
      // For example:
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
});

const useStyles = createStyles((theme) => ({
  icon: {
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
  },

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype?.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

const headCells = [
  {
    id: 'SR',
    numeric: true,
    disablePadding: true,
    label: 'ID',
    sort: true,
  },

  {
    id: 'title',
    numeric: false,
    disablePadding: false,
    label: 'Title',
    sort: true,
  },
  {
    id: 'regNo',
    numeric: false,
    disablePadding: false,
    label: 'Reg No',
    sort: true,
  },

  {
    id: 'manufacturer',
    numeric: false,
    disablePadding: false,
    label: 'Manufacturer',
    sort: true,
  },

  {
    id: 'make',
    numeric: false,
    disablePadding: false,
    label: 'Make/Model',
    sort: true,
  },

  {
    id: 'price',
    numeric: false,
    disablePadding: false,
    label: 'Price',
    sort: true,
  },

  {
    id: 'color',
    numeric: false,
    disablePadding: false,
    label: 'Color',
    sort: true,
  },

  {
    id: 'year',
    numeric: false,
    disablePadding: false,
    label: 'Year',
    sort: false,
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Category',
    sort: false,
  },
];
//

//
function EnhancedTableHead(props) {
  const {
    order,
    orderBy,

    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {headCells?.map((headCell) => (
          <TableCell
            style={{ fontWeight: 'bold' }}
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            // padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell?.sort === true ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const ViewCar = ({ setCurrentLocation }) => {
  const [carDetail, setCarDetail] = useState({});

  const matches1200 = useMediaQuery('(min-width: 1200px)');
  setCurrentLocation('View All Cars');
  let navigate = useNavigate();

  const [opened, setOpened] = useState(false);
  const [viewCars, setViewCars] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [allCars, setCars] = useState([]);

  const [search, setSearch] = useState('');
  const [disabled, setDisabled] = useState(true);

  const getAllCars = async () => {
    setLoading(true);
    try {
      const apiResponse = await carsApi.getAll();
      setLoading(false);

      if (apiResponse.data.success === true) {
        let data = apiResponse.data.data.cars.map((car, index) => {
          return {
            ...car,
            SR: index + 1,
          };
        });

        setFilterString(data);
        setCars(data);
      }
    } catch (e) {
      setLoading(false);
      showNotification({
        message:
          e.response?.data?.data ||
          e.response?.data?.message ||
          e.message ||
          'Something went wrong, please try again',
        title: 'Error',
        color: 'red',
      });
    }
  };
  useEffect(() => {
    getAllCars();
  }, [refresh]);

  useEffect(() => {
    filtering();
  }, [search, refresh]);

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allCars?.length) : 0;

  const [id, setId] = useState('');
  const deleteCar = (id) => {
    setOpened(true);
    setId(id);
  };
  const confirmDelete = async () => {
    setOpened(false);
    setLoading(true);
    try {
      const apiResponse = await carsApi.delete(id);
      setLoading(false);
      if (apiResponse.data.success) {
        // console.log(res.data);
        setRefresh(!refresh);

        showNotification({
          autoClose: 5000,
          style: { size: 'small' },

          title: 'Success',
          message: `Car Has Been Deleted From The System! 🤥`,
          styles: (theme) => ({
            root: {
              backgroundColor: theme.colors.red[6],
              borderColor: theme.colors.red[6],

              '&::before': { backgroundColor: theme.white },
            },

            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.red[7] },
            },
          }),
        });
      } else {
        showNotification({
          title: `Error`,
          color: 'red',
          message: `${apiResponse.data.data}`,
        });
      }
    } catch (e) {
      setLoading(false);
      showNotification({
        color: 'red',
        title: 'Oops - ERROR',
        message:
          e?.response?.data?.data ||
          e?.response?.data?.message ||
          e?.message ||
          'Something went wrong, please try again',
      });
    }
  };

  const [filterString, setFilterString] = useState([]);

  const filtering = () => {
    if (search === '') {
      setDisabled(true);
      return setFilterString(allCars);
    } else {
      setDisabled(false);
      return setFilterString(
        allCars.filter(
          (x) =>
            x.title?.toLowerCase().includes(search.toLowerCase()) ||
            x.make?.toLowerCase().includes(search.toLowerCase()) ||
            x.model?.toLowerCase().includes(search.toLowerCase()) ||
            x.manufacturer?.toLowerCase().includes(search.toLowerCase()) ||
            x.regNo?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  };

  return (
    // <ThemeProvider theme={darkTheme}>
    <>
      <ThemeProvider theme={theme}>
        <Paper style={{ position: 'relative' }}>
          <LoadingOverlay
            visible={loading}
            loaderProps={{ size: 'xl', color: 'pink', variant: 'bars' }}
            overlayOpacity={0.5}
            overlayColor="#c5c5c5"
          />

          <Paper shadow="xl" style={{ marginBottom: 10 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button
                component={Link}
                to={`/stats/add-car`}
                rightIcon={<Plus />}
                variant="filled"
                color="dark"
                radius="lg"
                p="s"
                m="md"
              >
                ADD Car
              </Button>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {matches1200 ? (
                  <>
                    <TextInput
                      label="Search"
                      placeholder="Search..."
                      p="s"
                      m="md"
                      icon={<UserSearch size={14} />}
                      value={search}
                      onChange={(event) => setSearch(event.currentTarget.value)}
                    />
                    <Button
                      rightIcon={<Filter />}
                      variant="filled"
                      color="blue"
                      // radius="lg"
                      p="s"
                      mt="xl"
                      mr="md"
                      disabled={disabled}
                      onClick={() => {
                        setSearch('');
                      }}
                    >
                      Clear
                    </Button>
                  </>
                ) : (
                  <>
                    <TextInput
                      placeholder="Search..."
                      p="s"
                      m="md"
                      icon={<UserSearch size={14} />}
                      value={search}
                      onChange={(event) => setSearch(event.currentTarget.value)}
                    />

                    <Menu
                      shadow="md"
                      width={200}
                      p="s"
                      mt={matches1200 && 'xl'}
                      mr="md"
                      // closeOnClickOutside={false}
                      closeOnItemClick={false}
                    >
                      <Menu.Target>
                        <ActionIcon variant="filled" color="yellow">
                          <Filter />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item>
                          <Button
                            rightIcon={<Filter />}
                            variant="filled"
                            color="blue"
                            fullWidth
                            // radius="lg"

                            disabled={disabled}
                            onClick={() => {
                              setSearch('');
                            }}
                          >
                            Clear
                          </Button>
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </>
                )}
              </div>
            </div>
          </Paper>

          <Modal
            styles={{
              title: {
                width: '100%',
                textAlign: 'center',
              },
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
            title={<Title>Car Details</Title>}
            opened={viewCars}
            onClose={() => setViewCars(false)}
            // variant="transparent"
            size={'90%'}
            radius="md"
            centered
            shadow={0}
            padding="xl"
          >
            <ViewCarModal carDetails={carDetail} />
          </Modal>

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
              Are you Sure You Want to Delete This Car?
            </Title>
            <Grid align="center" justify="space-around" p="md">
              <Grid.Col align="center" xs={3} sm={3} md={4} lg={4}>
                <Button
                  align="center"
                  color="light"
                  leftIcon={<TrashOff size={14} />}
                  onClick={() => setOpened(false)}
                >
                  No, Don't Delete
                </Button>
              </Grid.Col>
              <Grid.Col align="center" xs={5} sm={4} md={4} lg={4}>
                <Button
                  align="center"
                  color="red"
                  leftIcon={<Trash size={14} />}
                  onClick={() => confirmDelete()}
                >
                  Yes, Delete
                </Button>
              </Grid.Col>
            </Grid>
          </Modal>
          {filterString?.length !== 0 ? (
            <Paper sx={{ width: '100%', mb: 2 }}>
              <>
                <TableContainer>
                  <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={allCars?.length}
                    />
                    <TableBody>
                      {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 customer?.slice()?.sort(getComparator(order, orderBy)) */}
                      {stableSort(filterString, getComparator(order, orderBy))
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        ?.map((row, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {row?.SR}
                              </TableCell>
                              <TableCell align="left">
                                <Text>
                                  {row?.title.length > 20
                                    ? row?.title?.slice(0, 20) + '...'
                                    : row?.title}
                                </Text>
                              </TableCell>

                              <TableCell align="left">{row?.regNo}</TableCell>
                              <TableCell align="left">
                                {row?.manufacturer.length > 20
                                  ? row?.manufacturer?.slice(0, 20) + '...'
                                  : row?.manufacturer}
                              </TableCell>
                              <TableCell align="left">
                                {row?.make} - {row?.model}
                              </TableCell>
                              <TableCell align="left">{row?.price}</TableCell>
                              <TableCell align="left">{row?.color}</TableCell>
                              <TableCell align="left">{row?.year}</TableCell>
                              <TableCell align="left">
                                {row?.category?.name}
                              </TableCell>

                              <TableCell>
                                <SimpleGrid cols={3} spacing="xl">
                                  <ActionIcon
                                    color="dark"
                                    variant="transparent"
                                    onClick={() => {
                                      setCarDetail({
                                        ...row,
                                        category: row?.category?.name,
                                      });
                                      setViewCars(true);
                                    }}
                                  >
                                    <Eye color="#a905b6" />
                                  </ActionIcon>
                                  <ActionIcon
                                    color="dark"
                                    variant="transparent"
                                    onClick={() => {
                                      console.log('Clicked on edit button');

                                      navigate(`/stats/update-car/${row._id}`);
                                    }}
                                  >
                                    <Edit />
                                  </ActionIcon>

                                  <ActionIcon
                                    color="red"
                                    variant="transparent"
                                    onClick={() => deleteCar(row?._id)}
                                  >
                                    <Trash />
                                  </ActionIcon>
                                </SimpleGrid>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={allCars?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            </Paper>
          ) : (
            <Text weight="bold" align="center">
              No Data Found
            </Text>
          )}
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default ViewCar;
