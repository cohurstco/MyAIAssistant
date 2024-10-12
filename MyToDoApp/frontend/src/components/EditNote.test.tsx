import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditNote from './EditNote';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '123' }),
  useNavigate: () => jest.fn(),
}));

describe('EditNote Component', () => {
  const mockNote = {
    _id: '123',
    title: 'Test Note',
    content: 'This is a test note',
  };

  beforeEach(() => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockNote });
    (axios.put as jest.Mock).mockResolvedValue({ data: mockNote });
  });

  test('renders EditNote component', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<EditNote />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Edit Note')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText('Title')).toHaveValue('Test Note'));
    await waitFor(() => expect(screen.getByLabelText('Content')).toHaveValue('This is a test note'));
  });

  test('updates note on form submission', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<EditNote />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByLabelText('Title')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Test Note' } });
    fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'This is an updated test note' } });

    fireEvent.click(screen.getByText('Update Note'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:5000/api/notes/123',
        {
          title: 'Updated Test Note',
          content: 'This is an updated test note',
        }
      );
    });
  });

  test('handles error on note fetch', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch note'));

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<EditNote />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Edit Note')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText('Title')).toHaveValue(''));
    await waitFor(() => expect(screen.getByLabelText('Content')).toHaveValue(''));
  });

  test('handles error on note update', async () => {
    (axios.put as jest.Mock).mockRejectedValue(new Error('Failed to update note'));

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<EditNote />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Update Note')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Update Note'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
    });

    // In a real scenario, you might want to check for an error message displayed to the user
    // For now, we're just ensuring the function was called
  });
});