import { Card, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

import classes from './authcard.module.css';

const authenticationCardInfo = {
  register: {
    title: 'Create a new account',
    actionLink: '/login',
    actionLinkText: 'Login',
    actionDescription: 'Already have an account?',
  },
  login: {
    title: 'Log in to your account',
    actionLink: '/register',
    actionLinkText: 'Register',
    actionDescription: 'Need an account?',
  },
};

export type AuthCardProps = {
  children: ReactNode;
};

export function AuthCard({ children }: AuthCardProps) {
  const location = useLocation();
  const currentRoute = location.pathname.substring(
    1,
  ) as keyof typeof authenticationCardInfo;
  const { title, actionLink, actionLinkText, actionDescription } =
    authenticationCardInfo[currentRoute];

  return (
    <Flex
      className={classes.container}
      h="100dvh"
      align="center"
      justify="center"
    >
      <Card
        className={classes.card}
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
      >
        <Title order={2}>{title}</Title>
        <Stack mt="lg" gap="lg">
          {/* output the form in the children prop */}
          {children}
          <Divider />
          <Text className={classes.helper} ta="center">
            {actionDescription}
            <Link className={classes.anchor} to={actionLink}>
              {actionLinkText}
            </Link>
          </Text>
        </Stack>
      </Card>
    </Flex>
  );
}
