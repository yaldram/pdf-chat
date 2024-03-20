import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { Form, useNavigate } from 'react-router-dom';

import { login } from '../../api/users';
import { AuthCard } from '../../components/AuthCard';
import { APIError } from '../../lib/errors';

export default function LoginPage() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value ? null : 'please enter a username'),
      password: (value) => (value ? null : 'please enter a password'),
    },
  });

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: login,
    onSuccess() {
      navigate('/');
    },
    onError(error: APIError) {
      if (error.statusCode === 401) {
        notifications.show({
          id: 'login-error',
          withCloseButton: true,
          title: 'Wrong Credentials',
          message: 'Please enter correct username, password',
          color: 'red',
        });
      }
    },
  });

  return (
    <AuthCard>
      <Form
        onSubmit={form.onSubmit((values) => {
          loginUser(values);
        })}
      >
        <Stack gap="lg">
          <TextInput
            size="lg"
            type="text"
            label="Username"
            placeholder="Enter Username"
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
          <Button loading={isPending} type="submit" size="lg" fullWidth>
            Login
          </Button>
        </Stack>
      </Form>
    </AuthCard>
  );
}
