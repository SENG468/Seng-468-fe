import fileDownload from 'js-file-download';
import React, { useState } from 'react';
import { Grid, Loader, Segment, Dimmer, Button } from 'semantic-ui-react';
import { api } from '../../api/api';


export function Logs() {
  const [loading, setLoading] = useState(false);

  async function generateLogs() {
    try {
      let logs = await api.fetchDumplog('', 'logs');
      // Doesn't work yet
      fileDownload(logs, 'logs.xml')
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <Segment raised padded inverted>
        <Dimmer active={loading}>
          <Loader>Loading...</Loader>
        </Dimmer>
        <Grid divided columns={2}>
          <Button onClick={() => generateLogs()} content='Generate Logfile'/>
        </Grid>
      </Segment>
    </div>
  )
}
