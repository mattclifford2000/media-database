import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as api from './services/api';

jest.mock('./services/api');

test('renders Media Database header and displays items', async () => {
  api.fetchMediaItems.mockResolvedValue([
    {
      id: 1,
      title: 'Inception',
      type: 'Movie',
      creator: 'Christopher Nolan',
      releaseYear: 2010,
      genre: 'Sci-Fi, Action',
      overview: 'A thief who steals corporate secrets...',
      rating: 8.8,
      status: 'Completed',
      createdAt: '2026-01-01T00:00:00',
    },
  ]);

  render(<App />);

  // Expect header title
  const headerElement = screen.getByText(/Media Database/i);
  expect(headerElement).toBeInTheDocument();

  // Wait for item to load
  await waitFor(() => {
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });
  expect(screen.getByText(/Christopher Nolan/i)).toBeInTheDocument();
});
