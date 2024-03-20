import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { Form, useNavigate } from 'react-router-dom';

import { register } from '../../api/users';
import { AuthCard } from '../../components/AuthCard';
import { APIError } from '../../lib/errors';

export default function RegisterPage() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      fullname: '',
      username: '',
      password: '',
    },
    validate: {
      fullname: (value) => (value ? null : 'please enter fullname'),
      username: (value) => (value ? null : 'please enter a username'),
      password: (value) => (value ? null : 'please enter a password'),
    },
  });

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: register,
    onSuccess() {
      navigate('/login');
    },
    onError(error: APIError) {
      if (error.statusCode === 409) {
        notifications.show({
          id: 'register-conflict',
          withCloseButton: true,
          title: 'User exists',
          message: 'Please try with a different username',
          color: 'red',
        });
      }

      form.reset();
    },
  });

  return (
    <AuthCard>
      <Form
        onSubmit={form.onSubmit((values) => {
          registerUser(values);
        })}
      >
        <Stack gap="lg">
          <TextInput
            size="lg"
            type="text"
            label="Full Name"
            placeholder="Enter Full Name"
            required
            {...form.getInputProps('fullname')}
          />
          <TextInput
            size="lg"
            type="text"
            label="Username"
            placeholder="Enter user name"
            required
            {...form.getInputProps('username')}
          />
          <TextInput
            size="lg"
            type="password"
            label="Password"
            placeholder="Enter Password"
            required
            {...form.getInputProps('password')}
          />
          <Button type="submit" loading={isPending} size="lg" fullWidth>
            Register
          </Button>
        </Stack>
      </Form>
    </AuthCard>
  );
}
