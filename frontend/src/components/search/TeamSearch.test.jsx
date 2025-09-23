import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import TeamSearch from '@/components/search/TeamSearch';
import searchService from '@/api/services/searchService';

// Mock the search service
jest.mock('@/api/services/searchService', () => ({
  advancedSearchPlayers: jest.fn(),
  searchPlayersWithStats: jest.fn(),
  advancedSearchScouts: jest.fn()
}));

describe('TeamSearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with player search as default', () => {
    render(
      <BrowserRouter>
        <TeamSearch />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Find Players & Scouts')).toBeInTheDocument();
    expect(screen.getByText('Search by Player')).toBeInTheDocument();
    
    // Default select value should be "player"
    const selectElement = screen.getByRole('combobox');
    expect(selectElement.value).toBe('player');
  });

  test('can switch between player and scout search', () => {
    render(
      <BrowserRouter>
        <TeamSearch />
      </BrowserRouter>
    );
    
    // Initially on player search
    expect(screen.getByRole('combobox').value).toBe('player');
    
    // Switch to scout search
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'scout' } });
    expect(screen.getByRole('combobox').value).toBe('scout');
    
    // Check that scout search UI elements are showing
    expect(screen.getByText(/advanced search/i)).toBeInTheDocument();
  });

  test('performs player search', async () => {
    const mockPlayers = [
      { id: 1, full_name: 'John Doe', position: 'Forward' },
      { id: 2, full_name: 'Jane Smith', position: 'Midfielder' }
    ];
    
    searchService.advancedSearchPlayers.mockResolvedValue({ data: mockPlayers });
    
    render(
      <BrowserRouter>
        <TeamSearch />
      </BrowserRouter>
    );
    
    // Enter search query
    fireEvent.change(screen.getByPlaceholderText('Enter player name'), { 
      target: { value: 'John' } 
    });
    
    // Click search button
    fireEvent.click(screen.getByText('Search'));
    
    // Check search service was called with correct params
    await waitFor(() => {
      expect(searchService.advancedSearchPlayers).toHaveBeenCalledWith({ 
        name: 'John'
      });
    });
  });

  test('performs scout search', async () => {
    const mockScouts = [
      { id: 1, full_name: 'Mike Coach', nationality: 'USA' },
      { id: 2, full_name: 'Sarah Trainer', nationality: 'UK' }
    ];
    
    searchService.advancedSearchScouts.mockResolvedValue({ data: mockScouts });
    
    render(
      <BrowserRouter>
        <TeamSearch />
      </BrowserRouter>
    );
    
    // Switch to scout search
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'scout' } });
    
    // Enter search query
    fireEvent.change(screen.getByPlaceholderText('Enter scout name'), { 
      target: { value: 'Mike' } 
    });
    
    // Click search button
    fireEvent.click(screen.getByText('Search'));
    
    // Check search service was called with correct params
    await waitFor(() => {
      expect(searchService.advancedSearchScouts).toHaveBeenCalledWith({ 
        name: 'Mike'
      });
    });
  });
});