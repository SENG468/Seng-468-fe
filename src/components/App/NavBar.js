import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, Segment } from 'semantic-ui-react';
import { toast } from 'react-toastify';

export function NavBar({ setToken }) {
  const history = useHistory();

  const [activePath, setActivePath] = useState("/dashboard");

  function handleItemClick(path) {
    history.push(path);
    setActivePath(path);
  }

  function handleLogout() {
    toast.error("Error Fetching User Account.");
    setToken("");
    sessionStorage.removeItem('access_token');
    history.push('/');
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
          name='account'
          active={activePath === '/account'}
          onClick={() => handleItemClick('/account')}
        />
        <Menu.Item
          name='manage orders'
          active={activePath === '/orders'}
          onClick={() => handleItemClick('/orders')}
        />
        <Menu.Item
          name='transactions'
          active={activePath === '/transactions'}
          onClick={() => handleItemClick('/transactions')}
        />
        <Menu.Item
          name='about'
          active={activePath === '/about'}
          onClick={() => handleItemClick('/about')}
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
