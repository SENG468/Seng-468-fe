import fileDownload from 'js-file-download';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Grid, Loader, Segment, Dimmer, Button, Header, Divider, Input } from 'semantic-ui-react';
import { api } from '../../api/api';


export function Logs() {
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState('');
  const [username, setUsername] = useState('');
  const power = sessionStorage.getItem('user') === 'sysadmin' || sessionStorage.getItem('user') === 'admin';

  async function generateLogs() {
    setLoading(true);
    try {
      api.fetchDumplog(username, filename)
        .then(resp => resp.blob())
        .then(resp => {
          fileDownload(resp, `${filename}.xml`);
          toast.success('Successfully generated logfile');
          setLoading(false);
        });
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  async function generateUserLogs() {
    setLoading(true);
    try {
      api.fetchUserDumplog(filename)
        .then(resp => resp.blob())
        .then(resp => {
          fileDownload(resp, `${filename}.xml`);
          toast.success('Successfully generated logfile');
          setLoading(false);
        });
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <Segment raised padded inverted>
        <Dimmer active={loading}>
          <Loader>Generating Logfile...</Loader>
        </Dimmer>
        <Grid divided columns={2}>
          <Grid.Column width={10}>
            <Header color="teal" as="h1" content="Logfile Generation" />
            <Divider />
            {power ?
              <Input
                value={username}
                type='text'
                placeholder='Username'
                onChange={(e, { value }) => setUsername(value)}
              /> : ''
            }
            <br />
            <br />
            <Input
              value={filename}
              type='text'
              label='File name'
              placeholder='File name'
              onChange={(e, { value }) => setFilename(value)}
            />
            <br />
            <br />
            <Button color='green' onClick={() => { power ? generateLogs() : generateUserLogs() }} content='Generate Logfile' disabled={filename === ''} />
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  )
}
