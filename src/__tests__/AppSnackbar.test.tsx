import { fireEvent, render, screen } from '@testing-library/react';
import { AppSnackbar } from '../components/AppSnackbar';
import '@testing-library/jest-dom/extend-expect';

describe('AppSnackbar', () => {
  test('renders with default props', () => {
    render(
      <AppSnackbar
        message="Test message"
        isOpen
        alertProps={{ severity: 'success' }}
      />
    );
    const alertElement = screen.getByTestId('alert');
    expect(alertElement).toHaveTextContent('Test message');
  });

  test('opens and closes correctly', () => {
    const [isOpen, toggleOpen] = [true, jest.fn()];
    const handleClose = () => toggleOpen(!isOpen);

    render(
      <AppSnackbar
        message="Test message"
        isOpen={isOpen}
        alertProps={{ severity: 'success' }}
        snackbarProps={{ onClose: () => handleClose(), autoHideDuration: -1 }}
      />
    );
    const alertElement = screen.getByTestId('alert');
    const snackbarCloseElement = screen.getByTitle('Close');
    expect(alertElement).toHaveTextContent('Test message');
    expect(alertElement).toBeInTheDocument();
    fireEvent.click(snackbarCloseElement);
    expect(alertElement).not.toBeVisible();
  });
});
