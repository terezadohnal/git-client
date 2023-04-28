import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BackButton } from 'components/Buttons/BackButton';
import { MemoryRouter } from 'react-router-dom';

describe('BackButton', () => {
  test('renders back Button', () => {
    render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>
    );
    const backBtnElement = screen.getByTestId('Back-button' || 'Home-button');
    expect(backBtnElement).toBeInTheDocument();
    expect(backBtnElement).toHaveTextContent('Back' || 'Home');
    expect(backBtnElement).toHaveStyle('height: 40px');
    expect(backBtnElement).toBeEnabled();
  });

  test('renders with the correct text and icon', () => {
    let button = null;
    const { getByTestId } = render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>
    );
    button = getByTestId('Back-button' || 'Home-button');

    expect(button).toHaveTextContent('Back' || 'Home');
    expect(button).toContainHTML('<svg');
    if (button) fireEvent.click(button);
    expect(window.location.pathname).toBe('/' || '/repository');
  });
});
