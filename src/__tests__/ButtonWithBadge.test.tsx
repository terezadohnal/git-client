import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { CommitIcon } from 'components/icons/commit';
import { ButtonWithBadge } from '../components/Buttons/ButtonWithBadge';
import '@testing-library/jest-dom/extend-expect';

describe('ButtonWithBadge', () => {
  test('renders with default props', () => {
    const handleClick = jest.fn();
    render(
      <ButtonWithBadge
        label="Commit"
        onButtonPress={handleClick}
        icon={<CommitIcon />}
      />
    );
    const buttonWithBadgeElement = screen.getByTestId('button-with-badge');
    expect(buttonWithBadgeElement).toHaveTextContent('Commit');
  });

  test('displays badge when badgeNumber is provided', () => {
    const handleClick = jest.fn();
    render(
      <ButtonWithBadge
        label="Commit"
        badgeNumber={3}
        onButtonPress={handleClick}
        icon={<CommitIcon />}
      />
    );
    const badgeElement = screen.getByTestId('badge');
    expect(badgeElement).toHaveTextContent('3');
  });

  test('calls onButtonPress function when clicked', () => {
    const handleClick = jest.fn();
    render(
      <ButtonWithBadge
        label="Commit"
        onButtonPress={handleClick}
        icon={<CommitIcon />}
      />
    );
    fireEvent.click(screen.getByTestId('button-with-badge'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  afterEach(cleanup);
});
