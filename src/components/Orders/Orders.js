import React, { useState } from 'react';
import { Grid, Loader, Segment, Dimmer } from 'semantic-ui-react';


export function Orders() {
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <Segment raised padded inverted>
        <Dimmer active={loading}>
          <Loader>Loading...</Loader>
        </Dimmer>
        <Grid divided columns={2}>
          Order stuff, maybe tabs for buy, sell, triggers
        </Grid>
      </Segment>
    </div>
  )
}