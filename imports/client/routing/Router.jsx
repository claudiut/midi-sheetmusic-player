import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Player from '/imports/client/pages/Player';

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Player} />
        </Switch>
    </BrowserRouter>
);

export default Router;
