import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  ToggleButtonGroup,
  ToggleButton,
  Collapse,
  Alert,
} from 'react-bootstrap';
import { Avatar, Typography, Switch } from '@mui/material';
import { Person, Lock, Security, Notifications, Palette } from '@mui/icons-material';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [notificationSettings, setNotificationSettings] = useState(true);
  const [privacySettings, setPrivacySettings] = useState('friends');
  const [openSection, setOpenSection] = useState('profile');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleThemeChange = (newTheme) => {
    if (newTheme !== null) {
      setTheme(newTheme); // No need to access event.target.value, as newTheme is passed directly
    }
  };

  const handlePrivacyChange = (newPrivacy) => {
    setPrivacySettings(newPrivacy); // newPrivacy is the selected value
  };

  const handleNotificationChange = (e) => {
    setNotificationSettings(e.target.checked);
  };


  const handleSaveChanges = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSectionToggle = (section) => {
    setOpenSection(openSection === section ? '' : section);
  };

  return (
    <Container fluid className="p-4">
      <Row>
        <Col md={3}>
          <Card sx={{ marginBottom: '1rem' }}>
            <Card.Header sx={{ backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
              Profile
            </Card.Header>
            <Card.Body sx={{ textAlign: 'center', padding: '2rem' }}>
              <Avatar
                src="https://via.placeholder.com/150"
                sx={{
                  width: 120,
                  height: 120,
                  margin: 'auto',
                  border: '4px solid #007bff',
                }}
              />
              <Typography variant="h6">John Doe</Typography>
              <Typography variant="body2" color="textSecondary">
                john.doe@example.com
              </Typography>
            </Card.Body>
          </Card>

          <Card sx={{ marginBottom: '1rem' }}>
            <Card.Header sx={{ backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
              Menu
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '1rem', transition: 'background-color 0.3s' }}
                onClick={() => handleSectionToggle('profile')}
              >
                <Person sx={{ marginRight: '1rem' }} /> Profile
              </ListGroup.Item>
              <ListGroup.Item
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '1rem', transition: 'background-color 0.3s' }}
                onClick={() => handleSectionToggle('account')}
              >
                <Lock sx={{ marginRight: '1rem' }} /> Account
              </ListGroup.Item>
              <ListGroup.Item
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '1rem', transition: 'background-color 0.3s' }}
                onClick={() => handleSectionToggle('privacy')}
              >
                <Security sx={{ marginRight: '1rem' }} /> Privacy
              </ListGroup.Item>
              <ListGroup.Item
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '1rem', transition: 'background-color 0.3s' }}
                onClick={() => handleSectionToggle('notifications')}
              >
                <Notifications sx={{ marginRight: '1rem' }} /> Notifications
              </ListGroup.Item>
              <ListGroup.Item
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '1rem', transition: 'background-color 0.3s' }}
                onClick={() => handleSectionToggle('theme')}
              >
                <Palette sx={{ marginRight: '1rem' }} /> Theme
              </ListGroup.Item>
              <ListGroup.Item>
                <Button variant="danger" sx={{ marginTop: '1rem' }}>Logout</Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col md={9}>
          {showSuccess && (
            <Alert variant="success" sx={{ marginBottom: '1rem' }}>
              Changes saved successfully!
            </Alert>
          )}

          <Card sx={{ marginBottom: '1rem' }}>
            <Card.Header
              sx={{ marginBottom: '1rem', fontWeight: 'bold' }}
              onClick={() => handleSectionToggle('profile')}
              aria-controls="profile-settings"
              aria-expanded={openSection === 'profile'}
            >
              Profile Settings
            </Card.Header>
            <Collapse in={openSection === 'profile'}>
              <Card.Body id="profile-settings">
                <Form onSubmit={handleSaveChanges}>
                  <Form.Group controlId="profileName" sx={{ marginBottom: '1rem' }}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your name" defaultValue="John Doe" required />
                  </Form.Group>
                  <Form.Group controlId="profileEmail" sx={{ marginBottom: '1rem' }}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email" defaultValue="john.doe@example.com" required />
                  </Form.Group>
                  <Form.Group controlId="profilePassword" sx={{ marginBottom: '1rem' }}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter your password" required />
                  </Form.Group>
                  <Button variant="primary" type="submit" sx={{ marginTop: '1rem' }}>Save Changes</Button>
                </Form>
              </Card.Body>
            </Collapse>
          </Card>

          <Card sx={{ marginBottom: '1rem' }}>
            <Card.Header
              sx={{ marginBottom: '1rem', fontWeight: 'bold' }}
              onClick={() => handleSectionToggle('account')}
              aria-controls="account-settings"
              aria-expanded={openSection === 'account'}
            >
              Account Settings
            </Card.Header>
            <Collapse in={openSection === 'account'}>
              <Card.Body id="account-settings">
                <Form onSubmit={handleSaveChanges}>
                  <Form.Group controlId="accountEmail" sx={{ marginBottom: '1rem' }}>
                    <Form.Label>New Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter your new email" required />
                  </Form.Group>
                  <Form.Group controlId="accountPassword" sx={{ marginBottom: '1rem' }}>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter your new password" required />
                  </Form.Group>
                  <Button variant="primary" type="submit" sx={{ marginTop: '1rem' }}>Update Account</Button>
                </Form>
              </Card.Body>
            </Collapse>
          </Card>

          <Card sx={{ marginBottom: '1rem' }}>
            <Card.Header
              sx={{ marginBottom: '1rem', fontWeight: 'bold' }}
              onClick={() => handleSectionToggle('privacy')}
              aria-controls="privacy-settings"
              aria-expanded={openSection === 'privacy'}
            >
              Privacy Settings
            </Card.Header>
            <Collapse in={openSection === 'privacy'}>
              <Card.Body id="privacy-settings">
                <Form onSubmit={handleSaveChanges}>
                  <Form.Group controlId="privacySettings" sx={{ marginBottom: '1rem' }}>
                    <Form.Label>Who can see your profile?</Form.Label>
                    <ToggleButtonGroup
                      type="radio"
                      name="privacy"
                      value={privacySettings}
                      onChange={(_, newPrivacy) => handlePrivacyChange(newPrivacy)}
                    >
                      <ToggleButton id="privacyPublic" value="public" variant="outline-primary" sx={{ margin: '0.5rem' }}>
                        Public
                      </ToggleButton>
                      <ToggleButton id="privacyFriends" value="friends" variant="outline-primary" sx={{ margin: '0.5rem' }}>
                        Friends
                      </ToggleButton>
                      <ToggleButton id="privacyOnlyMe" value="onlyMe" variant="outline-primary" sx={{ margin: '0.5rem' }}>
                        Only Me
                      </ToggleButton>
                    </ToggleButtonGroup>

                  </Form.Group>
                  <Button variant="primary" type="submit" sx={{ marginTop: '1rem' }}>Save Privacy Settings</Button>
                </Form>
              </Card.Body>
            </Collapse>
          </Card>

          <Card sx={{ marginBottom: '1rem' }}>
            <Card.Header
              sx={{ marginBottom: '1rem', fontWeight: 'bold' }}
              onClick={() => handleSectionToggle('notifications')}
              aria-controls="notification-settings"
              aria-expanded={openSection === 'notifications'}
            >
              Notification Settings
            </Card.Header>
            <Collapse in={openSection === 'notifications'}>
              <Card.Body id="notification-settings">
                <Form onSubmit={handleSaveChanges}>
                  <Form.Group controlId="notifications" sx={{ marginBottom: '1rem' }}>
                    <Form.Check
                      type="switch"
                      id="emailNotifications"
                      label="Receive Email Notifications"
                      checked={notificationSettings}
                      onChange={handleNotificationChange}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" sx={{ marginTop: '1rem' }}>Save Notification Settings</Button>
                </Form>
              </Card.Body>
            </Collapse>
          </Card>

          <Card sx={{ marginBottom: '1rem' }}>
            <Card.Header
              sx={{ marginBottom: '1rem', fontWeight: 'bold' }}
              onClick={() => handleSectionToggle('theme')}
              aria-controls="theme-settings"
              aria-expanded={openSection === 'theme'}
            >
              Theme Settings
            </Card.Header>
            <Collapse in={openSection === 'theme'}>
              <Card.Body id="theme-settings">
                <Form onSubmit={handleSaveChanges}>
                  <Form.Group controlId="theme" sx={{ marginBottom: '1rem' }}>
                    <Form.Label>Select Theme</Form.Label>
                    <ToggleButtonGroup
                      type="radio"
                      name="theme"
                      value={theme}
                      onChange={(_, newTheme) => handleThemeChange(newTheme)}
                    >
                      <ToggleButton id="themeLight" value="light" variant="outline-primary" sx={{ margin: '0.5rem' }}>
                        Light
                      </ToggleButton>
                      <ToggleButton id="themeDark" value="dark" variant="outline-primary" sx={{ margin: '0.5rem' }}>
                        Dark
                      </ToggleButton>
                    </ToggleButtonGroup>

                  </Form.Group>
                  <Button variant="primary" type="submit" sx={{ marginTop: '1rem' }}>Save Theme Settings</Button>
                </Form>
              </Card.Body>
            </Collapse>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
