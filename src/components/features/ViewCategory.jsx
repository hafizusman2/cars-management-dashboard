// IMPORTS

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
import { ThemeProvider, createTheme } from '@mui/material';

import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';

import { Text, Group } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Filter, UserSearch } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import { Plus } from 'tabler-icons-react';

import { visuallyHidden } from '@mui/utils';
import { Menu } from '@mantine/core';

import { useState } from 'react';
import { Modal, Button, Title, Grid } from '@mantine/core';
import { Trash } from 'tabler-icons-react';
import { TrashOff } from 'tabler-icons-react';
import { Edit } from 'tabler-icons-react';
import { createStyles } from '@mantine/core';
import { useEffect } from 'react';
import ViewCategoryModal from '../modals/ViewCategoryModal';
import { categoriesApi } from '../../api/categories';

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
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
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
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Category Name',
    sort: true,
  },

  {
    id: 'createdAt',
    numeric: true,
    disablePadding: false,
    label: 'Created At',
    sort: true,
  },
  {
    id: 'actionsDontShow',
    numeric: false,
    disablePadding: false,
    label: 'Actions',
    sort: false,
  },
];

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
        {headCells.map((headCell) => (
          <TableCell
            style={{ fontWeight: 'bold' }}
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sort === true ? (
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

const ViewCategory = ({ setCurrentLocation }) => {
  const matches1200 = useMediaQuery('(min-width: 1200px)');
  const matches800 = useMediaQuery('(min-width: 800px)');

  setCurrentLocation('View All Categories');
  let navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [categories, setCategories] = React.useState([]);
  const [refresh, setRefresh] = React.useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState({});
  const [filterString, setFilterString] = useState([]);
  const getAllCategories = async () => {
    try {
      const apiResponse = await categoriesApi.getAll();
      if (apiResponse.data.success === true) {
        let data = apiResponse.data.data.map((category, index) => {
          return {
            ...category,
            SR: index + 1,
          };
        });
        setFilterString(data);
        setVisible(false);
        setCategories(data);
      }
    } catch (e) {
      console.log('ERROR', e);
      setVisible(false);
      showNotification({
        color: 'red',
        title: 'ERROR',
        message:
          e.response.data.data ||
          e.response.data.message ||
          e.message ||
          'Something went wrong, please try again',
      });
    }
  };

  const filtering = () => {
    if (search === '') {
      setDisabled(true);
      return setFilterString(categories);
    } else {
      setDisabled(false);
      return setFilterString(
        categories.filter((x) =>
          x.name?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  };
  useEffect(() => {
    getAllCategories();
  }, [refresh]);

  useEffect(() => {
    filtering();
  }, [refresh, search]);

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { classes } = useStyles();

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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categories.length) : 0;

  const [id, setId] = useState('');
  const deleteCategory = (id) => {
    setOpened(true);
    setId(id);
  };
  const confirmDelete = () => {
    setOpened(false);
    setVisible(true);

    try {
      const res = categoriesApi.delete(id);
      if (res.data.success) {
        showNotification({
          autoClose: 5000,
          style: { size: 'small' },
          title: 'Success',
          message: `Category has Been Deleted From The System! 🤥`,
        });
        setRefresh(!refresh);
      } else {
        setVisible(false);
        showNotification({
          title: `${'Oops'}`,
          color: 'red',
          message: `${res?.data?.message}`,
        });
      }
    } catch (e) {
      setVisible(false);
      showNotification({
        color: 'red',
        title: 'Oops - ERROR',
        message:
          e.response.data.data ||
          e.response.data.message ||
          e.message ||
          'Something went wrong, please try again',
      });
    }
  };

  return (
    <>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay
          visible={visible}
          loaderProps={{ size: 'xl', color: 'pink', variant: 'bars' }}
          overlayOpacity={0.5}
          overlayColor="#c5c5c5"
        />

        <div shadow="xl" style={{ marginBottom: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Button
              component={Link}
              to="/stats/add-category"
              rightIcon={<Plus />}
              variant="filled"
              color="dark"
              radius="lg"
              m="md"
            >
              ADD CATEGORY
            </Button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {matches1200 ? (
                <React.Fragment>
                  <TextInput
                    label="Search"
                    placeholder="Search..."
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

                    mt="xl"
                    mr="md"
                    disabled={disabled}
                    onClick={() => {
                      setSearch('');
                    }}
                  >
                    Clear
                  </Button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <TextInput
                    placeholder="Search..."
                    m="md"
                    icon={<UserSearch size={14} />}
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                  />

                  <Menu
                    closeOnItemClick={false}
                    shadow="md"
                    width={200}
                    mt={matches1200 && 'xl'}
                    mr="md"
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
                </React.Fragment>
              )}
            </div>
          </div>
        </div>

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
          title={<Title>Category Details</Title>}
          opened={categoryModal}
          onClose={() => setCategoryModal(false)}
          size={matches1200 ? 'xl' : 'md'}
          radius="md"
          centered
          shadow={0}
          padding="xl"
        >
          <ViewCategoryModal category={categoryName} />
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
            Are you Sure You Want to Delete This Category?
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
          <div sx={{ width: '100%', mb: 2 }}>
            {matches800 ? (
              <>
                <TableContainer>
                  <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <ThemeProvider theme={theme}>
                      <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={categories?.length}
                      />
                      <TableBody>
                        {stableSort(filterString, getComparator(order, orderBy))
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                  {row?.SR}
                                </TableCell>

                                {row?.name && (
                                  <TableCell align="left">
                                    {row?.name?.length > 15
                                      ? row?.name?.substr(0, 15) + '...'
                                      : row?.name}
                                  </TableCell>
                                )}

                                <TableCell align="left">
                                  {row?.createdAt
                                    ? row?.createdAt.split('T')[0]
                                    : 'N/A'}
                                </TableCell>
                                <TableCell>
                                  <SimpleGrid cols={3}>
                                    <ActionIcon
                                      color="dark"
                                      variant="transparent"
                                      onClick={() => {
                                        setCategoryName(row.name);
                                        setCategoryModal(true);
                                      }}
                                    >
                                      <Eye color="#a905b6" />
                                    </ActionIcon>

                                    <ActionIcon
                                      color="dark"
                                      variant="transparent"
                                      onClick={() => {
                                        navigate(
                                          `/stats/add-category/${row._id}`
                                        );
                                      }}
                                    >
                                      <Edit color="green" />
                                    </ActionIcon>

                                    <ActionIcon
                                      color="red"
                                      variant="transparent"
                                      onClick={() => deleteCategory(row?._id)}
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
                    </ThemeProvider>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={categories?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            ) : (
              filterString.map((row) => {
                return (
                  <Group position="apart" p="md">
                    <div>
                      <Group noWrap>
                        <div>
                          <Group
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Text
                              lineClamp={1}
                              size="lmdg"
                              weight={500}
                              className={classes.name}
                            >
                              {row?.name}
                            </Text>
                          </Group>
                        </div>
                      </Group>
                    </div>
                    <div>
                      <ActionIcon
                        color="dark"
                        variant="transparent"
                        onClick={() => {
                          setCategoryName(row);
                          setCategoryModal(true);
                        }}
                      >
                        <Eye color="#a905b6" />
                      </ActionIcon>

                      <ActionIcon
                        color="dark"
                        variant="transparent"
                        onClick={() => {
                          console.log('Clicked on edit button');
                          navigate(`/stats/add-category/${row._id}`);
                        }}
                      >
                        <Edit color="green" />
                      </ActionIcon>

                      <ActionIcon
                        color="red"
                        variant="transparent"
                        onClick={() => deleteCategory(row?._id)}
                      >
                        <Trash />
                      </ActionIcon>
                    </div>
                  </Group>
                );
              })
            )}
          </div>
        ) : (
          <Text weight="bold" align="center">
            No Data Found
          </Text>
        )}
      </div>
    </>
  );
};

export default ViewCategory;
