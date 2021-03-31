import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, Segment } from 'semantic-ui-react';

export function NavBar({ setToken }) {
  const history = useHistory();

  const [activePath, setActivePath] = useState(window.location.pathname);

  function handleItemClick(path) {
    history.push(path);
    setActivePath(path);
  }

  function handleLogout() {
    history.push('/');
    setToken("");
    sessionStorage.removeItem('access_token');
  }

  return (
    <Segment inverted>
      <Menu inverted secondary size='large'>
        <Menu.Item
          name='dashboard'
          active={activePath === '/dashboard'}
          onClick={() => handleItemClick('/dashboard')}
        />
        <Menu.Item
          name='transactions'
          active={activePath === '/transactions'}
          onClick={() => handleItemClick('/transactions')}
        />
        <Menu.Item
          name='logs'
          active={activePath === '/logs'}
          onClick={() => handleItemClick('/logs')}
        />
        <Menu.Menu position='right'>
          <Menu.Item
            name='logout'
            onClick={() => handleLogout()}
          />
        </Menu.Menu>
      </Menu>
    </Segment>
  )
}
