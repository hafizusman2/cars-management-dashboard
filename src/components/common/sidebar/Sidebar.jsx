import React from 'react';
import styled from 'styled-components';

import { SideBarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
const SidebarNav = styled.nav`
  background-position: center;

  width: '350px';
  height: '100%';
  height: 'fill';
  display: 'flex';
  justify-content: 'center';
  top: 0;
  transition: '600ms';
`;

const SidebarWrap = styled.div`
  width: '350px';
`;

const SideBar = ({ currentLocation, setOpened }) => {
  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <SidebarNav>
          {/* Convert to string */}
          <SidebarWrap>
            {SideBarData.map((item, index) => {
              return (
                <SubMenu
                  route={currentLocation}
                  item={item}
                  key={index}
                  setOpened={setOpened}
                />
              );
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default SideBar;
