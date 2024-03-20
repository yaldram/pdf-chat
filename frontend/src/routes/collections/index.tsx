import {
  ActionIcon,
  Affix,
  Box,
  Button,
  Fieldset,
  FileInput,
  FileInputProps,
  Flex,
  Modal,
  Pill,
  TagsInput,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconFileFunction, IconPlus } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Fragment, useState } from 'react';
import { Form, Outlet, useParams } from 'react-router-dom';

import { createPaper, getSignedUrl, uploadPaper } from '../../api/papers';
import {
  SegmentedNav,
  SegmentedNavRoutes,
} from '../../components/SegmentedNav';

const collectionTabRoutes: SegmentedNavRoutes[] = [
  {
    to: '',
    label: 'Papers',
    end: true,
  },
  {
    to: 'chat',
    label: 'Chat',
  },
];

export default function CollectionPage() {
  const client = useQueryClient();

  const [opened, { open, close }] = useDisclosure(false);
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [paperFile, setPaperFile] = useState<File | null>(null);

  const { mutate: addPaper, isPending } = useMutation({
    mutationFn: createPaper,
    onSuccess() {
      client.invalidateQueries({
        queryKey: [`papers-${params.collectionId}`],
      });
      close();
    },
  });

  const form = useForm({
    initialValues: {
      title: '',
      author: '',
      tags: [] as string[],
      fileUrl: '',
    },
    validate: {
      title: (value) => (value ? null : 'please enter the paper title'),
      author: (value) => (value ? null : 'please enter the author name'),
      fileUrl: (value) => (value ? null : 'please select a file'),
    },
  });

  async function handlePaperUpload(payload: File | null) {
    if (payload === null) return null;

    setPaperFile(payload);
    setLoading(true);

    const signedUrl = await getSignedUrl({
      filename: payload.name,
      contentType: payload.type,
    });

    await uploadPaper({
      signedUrl,
      file: payload,
    });

    const fileUrl = new URL(signedUrl);
    fileUrl.search = '';

    setLoading(false);
    form.setFieldValue('fileUrl', fileUrl.href);
    form.setFieldError('fileUrl', null);
  }

  return (
    <Fragment>
      <Modal
        size="lg"
        opened={opened}
        onClose={() => {
          form.reset();
          setPaperFile(null);
          close();
        }}
        closeButtonProps={{ disabled: loading }}
        title="Add Paper"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <FileInput
          accept="application/pdf"
          clearable={false}
          leftSection={<IconFileFunction />}
          label="Upload Pdf"
          leftSectionPointerEvents="none"
          value={paperFile}
          onChange={handlePaperUpload}
          required
          size="lg"
          valueComponent={ValueComponent}
          error={form.errors.fileUrl}
        />

        <Form
          onSubmit={form.onSubmit((values) => {
            if (!values.fileUrl)
              form.setFieldError('fileUrl', 'please select a file');
            addPaper({
              ...values,
              collectionId: params.collectionId as string,
            });
          })}
          method="POST"
        >
          <Fieldset mt="lg" disabled={loading || isPending}>
            <Flex mt="lg" direction="column" gap="md">
              <TextInput
                size="lg"
                type="text"
                label="Title"
                placeholder="Introduction: Arabic as a South Asian Language"
                required
                {...form.getInputProps('title')}
              />
              <TextInput
                size="lg"
                type="text"
                label="Author"
                placeholder="Nile Green"
                required
                {...form.getInputProps('author')}
              />
              <TagsInput
                size="lg"
                name="tags"
                label="Tags"
                placeholder="Add tags for your paper"
                // data={[]}
                {...form.getInputProps('tags')}
              />
              <Button type="submit" fullWidth mt="md" size="lg">
                Add Paper
              </Button>
            </Flex>
          </Fieldset>
        </Form>
      </Modal>
      <Flex p="lg" direction="column" gap="md" h="100%" w="100%">
        <Affix position={{ bottom: 40, right: 40 }}>
          <ActionIcon onClick={open} color="blue" radius="xl" size={60}>
            <IconPlus stroke={1.5} size={30} />
          </ActionIcon>
        </Affix>

        <Box>
          <SegmentedNav routes={collectionTabRoutes} />
        </Box>

        <Box h="95%" pb="lg">
          <Outlet />
        </Box>
      </Flex>
    </Fragment>
  );
}

const ValueComponent: FileInputProps['valueComponent'] = ({ value }) => {
  if (value === null) return null;

  if (Array.isArray(value)) {
    return (
      <Pill.Group>
        {value.map((file, index) => (
          <Pill key={index}>{file.name}</Pill>
        ))}
      </Pill.Group>
    );
  }

  return <Pill>{value.name}</Pill>;
};
