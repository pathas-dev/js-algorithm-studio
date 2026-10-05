import { useEffect, useState } from 'react';
import { Badge, Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';

export default function App() {
  const [english, setEnglish] = useState(false);
  useEffect(() => { document.documentElement.lang = english ? 'en' : 'ko'; }, [english]);
  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb={64}>
        <Text fw={800}>◈ Algorithm Studio</Text>
        <Button variant="default" onClick={() => setEnglish(!english)}>
          {english ? '한국어' : 'English'}
        </Button>
      </Group>
      <Stack gap="xl" maw={760}>
        <Badge variant="light">{english ? 'ONE STEP AT A TIME' : '한 단계씩, 확실하게'}</Badge>
        <Title order={1}>{english ? 'See the logic. Understand the why.' : '움직임으로 보고, 코드로 이해하세요.'}</Title>
        <Text size="lg" c="dimmed">
          {english ? 'A space to explore algorithm execution, code, and explanations together.' : '알고리즘의 실행 과정과 코드, 그 이유를 함께 탐색하는 학습 공간입니다.'}
        </Text>
        <Paper withBorder p="xl">
          <Text fw={700}>{english ? 'The workspace is ready.' : '학습 공간의 기반이 준비됐습니다.'}</Text>
          <Text mt="sm" c="dimmed">{english ? 'The first interactive lesson will be bubble sort.' : '첫 번째 단계별 학습은 버블 정렬입니다.'}</Text>
        </Paper>
      </Stack>
    </Container>
  );
}
