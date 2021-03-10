import React, { useState } from 'react';
import { Grid, Loader, Segment, Dimmer } from 'semantic-ui-react';


export function Transactions() {
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <Segment raised padded inverted>
        <Dimmer active={loading}>
          <Loader>Loading...</Loader>
        </Dimmer>
        <Grid divided columns={2}>
          Buy, sell history? Maybe you can download your logs here as well
        </Grid>
      </Segment>
    </div>
  )
}