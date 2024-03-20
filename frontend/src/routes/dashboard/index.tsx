import {
  TextInput,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
  Flex,
  Select,
  Box,
  Modal,
  Button,
  ScrollArea,
  Loader,
  Divider,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconPlus, IconHome } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Fragment, useEffect } from 'react';
import { Form, Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

import classes from './dashboard.module.css';
import { createCollection, fetchCollections } from '../../api/collections';
import { authenticate, logout } from '../../api/users';
import { Collection, User } from '../../types';
import { APIError } from '../../lib/errors';

const emojis = [
  { value: '📚', label: '📚 Academic Books' },
  { value: '📖', label: '📖 Research Papers' },
  { value: '📗', label: '📗 Study Guides' },
  { value: '😀', label: '😀 Happy Papers' },
  { value: '😂', label: '😂 Humorous Research' },
  { value: '😍', label: '😍 Fascinating Studies' },
  { value: '🥳', label: '🥳 Exciting Discoveries' },
  { value: '😎', label: '😎 Cool Insights' },
  { value: '🤩', label: '🤩 Impressive Papers' },
  { value: '🗺️', label: '🗺️ Geographical Studies' },
  { value: '🏞️', label: '🏞️ Landscape Research' },
  { value: '🌄', label: '🌄 Sunset Observations' },
  { value: '🌠', label: '🌠 Stellar Findings' },
  { value: '🕰️', label: '🕰️ Time-Related Studies' },
  { value: '🗿', label: '🗿 Historical Research' },
  { value: '🏛️', label: '🏛️ Archaeological Papers' },
  { value: '📜', label: '📜 Scroll-worthy Documents' },
  { value: '🔬', label: '🔬 Scientific Investigations' },
  { value: '🔭', label: '🔭 Astronomy Papers' },
  { value: '🌍', label: '🌍 Global Studies' },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    isPending,
    error,
    isError,
    data: userInfo,
  } = useQuery({
    queryKey: ['user'],
    queryFn: authenticate,
    retry: false,
  });

  useEffect(() => {
    async function handleError() {
      const resolvedError = (await Promise.resolve(error)) as APIError;
      if (isError && resolvedError && resolvedError?.statusCode === 401) {
        navigate('/login');
      }
    }

    handleError();
  }, [isError, error, navigate]);

  if (isPending) {
    return (
      <Flex align="center" justify="center">
        <Loader />
      </Flex>
    );
  }

  if (isError) return <div>Error...</div>;

  return <MainPage user={userInfo} />;
}

function MainPage({ user }: { user: User }) {
  const client = useQueryClient();
  const navigate = useNavigate();

  const { isPending, data: collections = [] } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
  });

  const { mutate: addCollection, isPending: loading } = useMutation({
    mutationFn: createCollection,
    onSuccess() {
      client.invalidateQueries({
        queryKey: ['collections'],
      });
    },
  });

  const { mutate: logoutUser, isPending: loadingLogout } = useMutation({
    mutationFn: logout,
    onSuccess() {
      navigate('/login');
    },
  });

  const form = useForm({
    initialValues: {
      name: '',
      emoji: '📚',
    },
    validate: {
      name: (value) => (value ? null : 'please enter the collection name'),
      emoji: (value) => (value ? null : 'please select an emoji'),
    },
  });

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Fragment>
      <Modal
        opened={opened}
        onClose={() => {
          close();
          form.reset();
        }}
        title="Create Collection"
        centered
        size="lg"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Form
          onSubmit={form.onSubmit((values) => {
            addCollection(values);
            close();
            form.reset();
          })}
          method="POST"
        >
          <Flex direction="column" gap="md">
            <TextInput
              type="text"
              label="Collection"
              placeholder="Eastern Philosophy"
              required
              size="md"
              {...form.getInputProps('name')}
            />
            <Select
              size="md"
              label="Your favorite library"
              placeholder="Pick value"
              data={emojis}
              clearable
              checkIconPosition="right"
              {...form.getInputProps('emoji')}
            />
            <Button type="submit" fullWidth mt="md" size="md" loading={loading}>
              Create Collection
            </Button>
          </Flex>
        </Form>
      </Modal>

      <Flex h="100dvh">
        <nav className={classes.navbar}>
          <Box mb="sm" px="md">
            <Group justify="space-between">
              <Title order={1}>PDF Chat</Title>
              <Tooltip label="Go to Home" withArrow position="left">
                <ActionIcon
                  component={Link}
                  to="/"
                  size="lg"
                  variant="outline"
                  aria-label="Home"
                >
                  <IconHome
                    style={{ width: '70%', height: '70%' }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Box>

          <Group
            className={classes.collectionsHeader}
            justify="space-between"
            align="center"
          >
            <Text size="lg" fw={500}>
              Your Collections
            </Text>
            <Tooltip label="Create collection" withArrow position="left">
              <ActionIcon size="lg" onClick={open} variant="default">
                <IconPlus size={15} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <TextInput
            placeholder="Search Collections"
            leftSection={
              <IconSearch
                style={{ width: rem(12), height: rem(12) }}
                stroke={1.5}
              />
            }
            rightSectionWidth={70}
            styles={{ section: { pointerEvents: 'none' } }}
            my="lg"
            size="md"
            px="md"
          />

          <Divider />
          {isPending ? (
            <Flex h="100%" justify="center" align="center">
              <Loader size={25} />
            </Flex>
          ) : (
            <ScrollArea h="100%">
              <div className={classes.collections}>
                <CollectionsList collections={collections} />
              </div>
            </ScrollArea>
          )}

          <Box className={classes.bottom} w="100%">
            <Divider />
            <Group p="md" justify="space-between">
              <Box>
                <Text size="lg" fw={600}>
                  {user.fullname}
                </Text>
                <Text size="md">@ {user.username}</Text>
              </Box>
              <Form>
                <Button
                  onClick={() => logoutUser()}
                  loading={loadingLogout}
                  type="submit"
                  size="sm"
                >
                  Logout
                </Button>
              </Form>
            </Group>
          </Box>
        </nav>
        <Box w="100%">
          <Outlet />
        </Box>
      </Flex>
    </Fragment>
  );
}

type CollectionListProps = {
  collections: Collection[];
};

function CollectionsList({ collections }: CollectionListProps) {
  return collections.map((collection) => (
    <NavLink
      to={`collections/${collection._id}`}
      key={collection._id}
      className={({ isActive }) =>
        isActive
          ? `${classes.collectionLink} ${classes.active}`
          : classes.collectionLink
      }
    >
      <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
        {collection.emoji}
      </span>
      <Text display="inline" size="md">
        {' '}
        {collection.name}
      </Text>
    </NavLink>
  ));
}
