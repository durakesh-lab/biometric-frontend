import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Tabs, Tab, Box } from '@mui/material';

const LeaveManagementTabs = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('summary');

  // Map URL paths to tab values
  const tabRoutes = {
    summary: '/Leavemanagement/myleaves/summary',
    balance: '/Leavemanagement/myleaves/balance',
    requests: '/Leavemanagement/myleaves/leaverequest',
    shift: '/Leavemanagement/myleaves/shift',
    holiday: '/Leavemanagement/myleaves/holiday'
  };

  // Set initial tab based on current route
  React.useEffect(() => {
    const currentTab = Object.keys(tabRoutes).find(
      key => router.pathname === tabRoutes[key]
    );
    if (currentTab) setActiveTab(currentTab);
  }, [router.pathname]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    router.push(tabRoutes[newValue]);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs 
        value={activeTab}
        onChange={handleTabChange}
        aria-label="Leave management tabs"
        variant="scrollable"
      >
        <Tab 
          label="Leave Summary" 
          value="summary" 
          sx={{ textTransform: 'none', fontWeight: activeTab === 'summary' ? 600 : 400 }}
        />
        <Tab 
          label="Leave Balance" 
          value="balance" 
          sx={{ textTransform: 'none', fontWeight: activeTab === 'balance' ? 600 : 400 }}
        />
        <Tab 
          label="Leave Requests" 
          value="requests" 
          sx={{ textTransform: 'none', fontWeight: activeTab === 'requests' ? 600 : 400 }}
        />
        <Tab 
          label="Shift" 
          value="shift" 
          sx={{ textTransform: 'none', fontWeight: activeTab === 'shift' ? 600 : 400 }}
        />
          <Tab 
          label="Holiday" 
          value="holiday" 
          sx={{ textTransform: 'none', fontWeight: activeTab === 'holiday' ? 600 : 400 }}
        />
      </Tabs>
    </Box>
  );
};

export default LeaveManagementTabs;